<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->dateTime('event_date');
            $table->string('location_name');
            $table->string('google_maps_url')->nullable(); 
            $table->decimal('ticket_price', 10, 2)->default(0.00);
            $table->integer('max_capacity')->nullable();
            $table->integer('tickets_sold')->default(0);
            $table->json('images')->nullable(); 
            $table->enum('status', ['draft', 'upcoming', 'past', 'cancelled'])->default('draft');
            $table->boolean('registration_open')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
