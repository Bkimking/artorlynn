<?php

use App\Providers\AppServiceProvider;
use App\Providers\FortifyServiceProvider;
use Webklex\LaravelIMAP\Providers\LaravelIMAPServiceProvider;

return [
    AppServiceProvider::class,
    FortifyServiceProvider::class,
    LaravelIMAPServiceProvider::class,
];
