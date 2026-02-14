<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Archives>
 */
class ArchivesFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(), // ★ これが最重要
            'video_id' => $this->faker->uuid(),
            'title' => $this->faker->sentence(),
            'thumbnail' => 'https://example.com/thumb.jpg',
            'published_at' => now(),
        ];
    }
}
