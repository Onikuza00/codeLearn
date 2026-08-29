<?php

namespace App\Service;

    class SlugGenerator
{
    public function generate(string $text):string
    {
        $new = trim(mb_strtolower($text));
        $new = iconv('UTF-8', 'ASCII//TRANSLIT', $new);
        $new = preg_replace('/[^a-z0-9]+/', '-', $new);
        return trim($new, '-');

    }
}
