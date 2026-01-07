<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ActualiterController extends AbstractController
{
    #[Route('/actualiter', name: 'app_actualiter')]
    public function index(): Response
    {
        return $this->render('actualiter/index.html.twig', [
            'controller_name' => 'ActualiterController',
        ]);
    }
}
