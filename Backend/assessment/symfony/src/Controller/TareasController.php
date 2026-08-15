<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\TareaRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Tarea;
use Symfony\Component\HttpFoundation\Request;

final class TareasController extends AbstractController
{
    #[Route('/tareas', name: 'app_tareas')]
    public function index(TareaRepository $tareaRepository): Response
    {
        $lista =  $tareaRepository->findAll();
        return $this->render('tareas/index.html.twig', [
            'lista' => $lista,
        ]);
    }

    #[Route('/tareas/{id}', name: 'tarea_id')]
    public function buscar(Tarea $tarea): Response
    {
         return $this->render('tareas/show.html.twig', [
            'tarea' => $tarea,
        ]);
    }

    #[Route('/tareas/crear', name: 'tarea_crear', methods: 'POST')]
    public function crear(Request $request, EntityManagerInterface $em): Response
    {
        $titulo = $request->query->get('title');
        $tarea = new Tarea();
        $tarea->setTitle($titulo);
        $tarea->setDone(false);
        $tarea->setCreatedAt(new \DateTimeImmutable());
        $em->persist($tarea);
        $em->flush();
        return $this->redirectToRoute('app_tareas');
    }

    #[Route('/tareas/{id}/completar', name: 'tarea_completada', methods: 'POST')]
    public function tareaCompletada(Tarea $tarea, EntityManagerInterface $em): Response
    {
        $tarea->setDone(true);
        $em->flush();
        return $this->redirectToRoute('app_tareas');
    }

    #[Route('/tareas/{id}/borrar', name: 'tarea_borrada', methods: 'POST')]
    public function tareaBorrada(Tarea $tarea, EntityManagerInterface $em): Response
    {
        $em->remove($tarea);
        $em->flush();
        return $this->redirectToRoute('app_tareas');
    }

   
}
