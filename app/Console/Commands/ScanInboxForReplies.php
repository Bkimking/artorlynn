<?php

namespace App\Console\Commands;

use App\Models\ContactSubmission;
use App\Models\ContactSubmissionReply;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Webklex\IMAP\Facades\Client;

class ScanInboxForReplies extends Command
{
    protected $signature = 'pipe:scan-inbox';

    protected $description = 'Scan inbox for replies to contact submissions';

    public function handle(): void
    {
        $client = Client::account('default');
        $client->connect();

        $folders = ['INBOX', 'Spam'];

        foreach ($folders as $folderName) {
            try {
                $folder = $client->getFolder($folderName);

                if (! $folder) {
                    $this->info("Folder {$folderName} not found, skipping.");

                    continue;
                }

                $messages = $folder->messages()->since(now()->subDays(7))->get();
                $this->processMessages($messages);

            } catch (\Exception $e) {
                $this->info("Error scanning {$folderName}: ".$e->getMessage());

                continue;
            }
        }

        $client->disconnect();
        $this->info('Inbox scan complete.');
    }

    private function processMessages($messages): void
    {
        foreach ($messages as $message) {
            $subject = mb_decode_mimeheader($message->getSubject() ?? '');

            preg_match('/\[MSG-([a-zA-Z0-9_]+)\]/', $subject, $matches);

            if (empty($matches[1])) {
                continue;
            }

            $msgId = $matches[1];
            $submission = ContactSubmission::where('msg_id', $msgId)->first();

            if (! $submission) {
                continue;
            }

            // Duplicate check
            $alreadyPiped = ContactSubmissionReply::where('msg_id', $msgId)
                ->where('sender_email', $message->getFrom()[0]->mail)
                ->exists();

            if ($alreadyPiped) {
                $this->info("Already piped MSG-{$msgId} — skipping.");

                continue;
            }

            $rawBody = $message->getTextBody() ?? $message->getHTMLBody() ?? '';
            $cleanBody = $this->stripQuotedHistory($rawBody);

            if (empty(trim($cleanBody))) {
                continue;
            }

            ContactSubmissionReply::create([
                'contact_submission_id' => $submission->id,
                'msg_id' => $msgId,
                'direction' => 'inbound',
                'body' => trim($cleanBody),
                'sender_email' => $message->getFrom()[0]->mail,
                'replied_at' => Carbon::now(),
            ]);

            $submission->update([
                'status' => 'replied',
                'replied_at' => Carbon::now(),
            ]);

            $message->setFlag('Seen');
            $this->info("Piped reply for MSG-{$msgId}");
        }
    }

    private function stripQuotedHistory(string $body): string
    {
        $body = html_entity_decode(strip_tags($body));

        $patterns = [
            '/On\s.+?wrote:.*/is',
            '/From:\s.+/is',
            '/_{5,}/',
            '/-{5,}Original/i',
            '/>+.*/',
        ];

        foreach ($patterns as $pattern) {
            $body = preg_split($pattern, $body)[0];
        }

        return trim($body);
    }
}
