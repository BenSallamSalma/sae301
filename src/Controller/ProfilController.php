<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ProfilController extends AbstractController
{
    #[Route('/profil', name: 'app_profil')]
    public function index(): Response
    {
        return $this->render('profil/index.html.twig', [
            'controller_name' => 'ProfilController',
        ]);
    }

    #[Route('/profil/connexion', name: 'app_profil_connexion')]
    public function connexion(): Response
    {
        return $this->render('profil/connexion.html.twig', [
            'controller_name' => 'ConnexionController',
        ]);
    }

    #[Route('/profil/deconnexion', name: 'app_profil_deconnexion')]
    public function deconnexion(): Response
    {
        return $this->render('profil/deconnexion.html.twig', [
            'controller_name' => 'DeconnexionController',
        ]);
    }

    #[Route('/profil/inscription', name: 'app_profil_inscription')]
    public function inscription(): Response
    {
        return $this->render('profil/inscription.html.twig', [
            'controller_name' => 'InscriptionController',
        ]);
    }
}
