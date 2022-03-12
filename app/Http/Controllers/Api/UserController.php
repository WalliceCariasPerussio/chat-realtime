<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    public function me()
    {
        return response()->json([
            'user' => Auth::user()
        ],Response::HTTP_OK);
    }

    public function index()
    {
        return response()->json([
            'users' => User::where('id','<>',Auth::user()->id)->get()
        ],Response::HTTP_OK);
    }

    public function show(User $userId)
    {
        return response()->json([
            'user' => $userId
        ],Response::HTTP_OK);
    }
}
