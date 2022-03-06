<?php

use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group(['middleware' => ['auth:sanctum', 'verified']], function(){
    Route::get('/users',[UserController::class,'index'])->name('users.index');
    Route::get('/messages/{userId}',[MessageController::class,'listMessages'])->name('messages.listMessages');
});
