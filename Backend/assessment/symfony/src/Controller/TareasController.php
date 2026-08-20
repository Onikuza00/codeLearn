<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\TareaRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Tarea;
use App\Form\{TareaType,BusquedaType};
use Symfony\Component\HttpFoundation\Request;

final class TareasController extends AbstractController
{
    #[Route('/tareas', name: 'app_tareas')]
    public function index(Request $request, TareaRepository $tareaRepository): Response
    {
        $termino = $request->query->get('termino');
        $form = $this->createForm(BusquedaType::class);
        if($termino)
        $lista =  $tareaRepository->findByTitle($termino);
        
        else
        $lista =  $tareaRepository->findAll();    
        
        return $this->render('tareas/index.html.twig', [
            'lista' => $lista, 'busqueda' => $form->createView()

            ]);
    }

    #[Route('/tareas/crear', name: 'tarea_crear', methods: (['GET', 'POST']))]
    public function crear(Request $request, EntityManagerInterface $em): Response
    {
        $tarea = new Tarea();
        $tarea->setDone(false);
        $tarea->setCreatedAt(new \DateTimeImmutable());
        $form = $this->createForm(TareaType::class, $tarea);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()){
            $em->persist($tarea);
            $em->flush();

            $this->addFlash('success', 'Tarea añadida correctamente.');
            return $this->redirectToRoute('app_tareas');
        }
        return $this->render('tareas/crear.html.twig', [
            'formularioTarea' => $form->createView(),
        ]);
        # METODO BASICO DE CREAR UNA TAREA ->
        /*
        $titulo = $request->query->get('title');
        $tarea = new Tarea();
        $tarea->setTitle($titulo);
        $tarea->setDone(false);
        $tarea->setCreatedAt(new \DateTimeImmutable());
        $em->persist($tarea);
        $em->flush();
        return $this->redirectToRoute('app_tareas');
        */
    }

    #[Route('/tareas/{id}', name: 'tarea_id')]
    public function buscar(Tarea $tarea): Response
    {
         return $this->render('tareas/show.html.twig', [
            'tarea' => $tarea,
        ]);
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

    #[Route('/tareas/{id}/editar', name: 'tarea_editar', methods: (['GET', 'POST']))]
    public function tareaEditada(Request $request, Tarea $tarea, EntityManagerInterface $em): Response
    {
        $form = $this->createForm(TareaType::class, $tarea, ['edicion' => true]);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()){
            $em->flush();

            $this->addFlash('success', 'Tarea editada correctamente.');
            return $this->redirectToRoute('app_tareas');
        }
        return $this->render('tareas/crear.html.twig', [
            'formularioTarea' => $form->createView(),
        ]);
    }
}
