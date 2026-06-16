import { Head, router, useForm, usePage } from "@inertiajs/react";
import MessagesLayouts from "@/layouts/messages/layouts";
import { useState, useEffect } from "react";
import TextEditor from "@/components/ui/text-editor";
import { Button } from "@/components/ui/button";
import messagesRoutes from "@/routes/messages";
import { formatDistanceToNow, format, isToday, isYesterday } from "date-fns";

interface Reply {
    id: number;
    direction: 'inbound' | 'outbound';
    body: string;
    sender_email: string;
    replied_at: string;
}

interface Submission {
    id: number;
    msg_id: string;
    name: string;
    email: string;
    service: string | null;
    message: string;
    status: 'unread' | 'read' | 'replied' | 'archived';
    created_at: string;
    replies: Reply[];
}

interface Props {
    submissions: Submission[];
    selected?: Submission;
}

function formatMessageTime(dateStr: string): string {
    try {
        const date = new Date(dateStr);
        if (isToday(date))     return format(date, 'h:mm a');
        if (isYesterday(date)) return 'Yesterday';
        return format(date, 'MMM d');
    } catch {
        return '';
    }
}

function formatReplyTime(dateStr: string): string {
    try {
        return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
        return '';
    }
}

/** Last activity timestamp: latest reply time, or original message time if no replies */
function lastActivity(s: Submission): number {
    if (s.replies.length > 0) {
        return new Date(s.replies[s.replies.length - 1].replied_at).getTime();
    }
    return new Date(s.created_at).getTime();
}

function defaultSelection(submissions: Submission[], serverSelected?: Submission): Submission | null {
    if (serverSelected) return serverSelected;
    if (submissions.length === 0) return null;
    // Server already sorts by last activity desc — find latest unread, else take first.
    const latestUnread = submissions
        .filter(s => s.status === 'unread')
        .sort((a, b) => lastActivity(b) - lastActivity(a))[0];
    return latestUnread ?? submissions[0];
}

export default function Messages({ submissions, selected: serverSelected }: Props) {
    const { props } = usePage<Props & { selected?: Submission }>();
    const [selected, setSelected] = useState<Submission | null>(() =>
        defaultSelection(submissions, serverSelected)
    );
    const { data, setData, post, processing, reset } = useForm({ body: '' });

    // Keep selected in sync after Inertia reloads props (same pattern as partners)
    useEffect(() => {
        if (selected) {
            const fresh = props.submissions.find(s => s.id === selected.id);
            if (fresh) setSelected(fresh);
        }
    }, [props.submissions]);

    // If the auto-selected submission on mount is unread, mark it read immediately
    useEffect(() => {
        if (selected && selected.status === 'unread' && !serverSelected) {
            router.patch(messagesRoutes.read(selected.id).url, {}, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    }, []); // run once on mount only

    function selectSubmission(submission: Submission) {
        setSelected(submission);
        if (submission.status === 'unread') {
            router.patch(messagesRoutes.read(submission.id).url, {}, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    }

    function submitReply() {
        if (!selected) return;
        post(`/admin/contacts/${selected.id}/reply`, {
            preserveScroll: true,
            onSuccess: () => {
                reset('body');
                // Reload only submissions prop — mirrors the partners pattern
                router.reload({ only: ['submissions'] });
            },
        });
    }

    const lastMessage = (s: Submission) => {
        if (s.replies.length > 0) return s.replies[s.replies.length - 1].body;
        return s.message;
    };

    const statusDot = (s: Submission) => {
        if (s.status === 'unread')   return 'bg-blue-500';
        if (s.status === 'replied')  return 'bg-emerald-500';
        return null;
    };

    return (
        <>
            <Head title="Messages" />
            <MessagesLayouts
                list={
                    <div className="flex flex-col h-full">
                        <div className="px-4 py-3 border-b border-sidebar-border flex items-center justify-between">
                            <h2 className="text-sm font-semibold">Messages</h2>
                            <span className="text-xs text-muted-foreground">
                                {submissions.filter(s => s.status === 'unread').length > 0 && (
                                    <span className="font-semibold text-primary">
                                        {submissions.filter(s => s.status === 'unread').length} unread
                                    </span>
                                )}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto divide-y divide-sidebar-border">
                            {submissions.length === 0 && (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2 py-12">
                                    <span>No messages yet</span>
                                </div>
                            )}
                            {submissions.map((s) => {
                                const dot = statusDot(s);
                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => selectSubmission(s)}
                                        className={`w-full text-left px-4 py-3 hover:bg-sidebar-accent transition-colors ${
                                            selected?.id === s.id ? 'bg-sidebar-accent' : ''
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-sm font-medium ${
                                                s.status === 'unread' ? 'text-foreground' : 'text-muted-foreground'
                                            }`}>
                                                {s.name}
                                            </span>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                {dot && <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />}
                                                <span className="text-xs text-muted-foreground">
                                                    {formatMessageTime(
                                                        s.replies.length > 0
                                                            ? s.replies[s.replies.length - 1].replied_at
                                                            : s.created_at
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {lastMessage(s).replace(/<[^>]*>/g, '').slice(0, 60)}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                }
                detail={
                    selected ? (
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-sidebar-border shrink-0">
                                <p className="font-semibold text-sm">{selected.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {selected.email}{selected.service && ` · ${selected.service}`}
                                </p>
                            </div>

                            {/* Thread */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
                                {/* Original message */}
                                <div className="flex justify-start">
                                    <div className="max-w-[70%] bg-sidebar-accent rounded-2xl rounded-tl-sm px-4 py-2.5">
                                        <p className="text-xs text-muted-foreground mb-1">
                                            {selected.email} · {formatReplyTime(selected.created_at)}
                                        </p>
                                        <p className="text-sm">{selected.message}</p>
                                    </div>
                                </div>

                                {/* Replies */}
                                {selected.replies.map((reply) => (
                                    <div key={reply.id} className={`flex ${reply.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                                            reply.direction === 'outbound'
                                                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                                : 'bg-sidebar-accent rounded-tl-sm'
                                        }`}>
                                            <p className={`text-xs mb-1 ${
                                                reply.direction === 'outbound' ? 'opacity-70' : 'text-muted-foreground'
                                            }`}>
                                                {reply.direction === 'outbound' ? 'You' : reply.sender_email}
                                                {' · '}{formatReplyTime(reply.replied_at)}
                                            </p>
                                            <div
                                                className="text-sm"
                                                dangerouslySetInnerHTML={{ __html: reply.body }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Reply composer */}
                            <div className="px-6 py-4 border-t border-sidebar-border shrink-0">
                                <TextEditor
                                    value={data.body}
                                    onChange={(val: string) => setData('body', val)}
                                />
                                <div className="flex justify-end mt-2">
                                    <Button
                                        onClick={submitReply}
                                        disabled={processing || !data.body}
                                        size="sm"
                                    >
                                        {processing ? 'Sending...' : 'Send Reply'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
                            <span>Select a message to view</span>
                        </div>
                    )
                }
            />
        </>
    );
}

Messages.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Messages', href: '/admin/messages' },
    ],
};