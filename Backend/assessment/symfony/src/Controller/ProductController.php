<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Product;
use App\Form\{ProductType};
use App\Service\SlugGenerator;
use App\Repository\ProductRepository;
use App\Repository\ProductSearchRepository;

final class ProductController extends AbstractController
{
    #[Route('/product', name: 'product_index')]
    public function index(Request $request, ProductRepository $productRepository): Response
    {
        $form = $this->createForm(ProductSearchType::class, null, ['method' => 'GET']);
        $form->handleRequest($request);
        $term = $form->get('term')->getData();
        $products = $term ? $productRepository->findByNameLike($term) :
        $productRepository->findAll();
        return $this->render('product/index.html.twig', ['products' => $products, 'searchForm' => $form]);
    }

    #[Route('/product/new', name: 'product_new', methods: ['GET', 'POST'])]
    public function new(Request $request, SlugGenerator $slug, EntityManagerInterface $em): Response
    {
        $product = new Product();
        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()){
            $product->setSlug($slug->generate($product->getName()));
            $em->persist($product);
            $em->flush();

            $this->addFlash('success', 'Producto añadido correctamente.');
            return $this->redirectToRoute('product_index');
        }

       return $this->render('product/new.html.twig', [
            'formProduct' => $form->createView(),
        ]);
    }

    #[Route('/product/{id}/edit', name: 'product_edit', methods: ['POST', 'GET'])]
     public function edit(Request $request, Product $product, EntityManagerInterface $em): Response
    {
        $form = $this->createForm(ProductType::class, $product, ['is_edit' => true]);
        $form->handleRequest($request);

        if($form->isSubmitted() && $form->isValid()){
            $em->flush();

            $this->addFlash('success', 'Producto editado correctamente.');
            return $this->redirectToRoute('product_index');
        }


       return $this->render('product/edit.html.twig', [
            'formProduct' => $form->createView(),
        ]);
    }

     #[Route('/product/{id}/delete', name: 'product_delete', methods: ['POST'])]
     public function delete(Request $request, Product $product, EntityManagerInterface $em): Response
    {
        if ($this->isCsrfTokenValid('delete' . $product->getId(), $request->request->get('_token'))){
            $em->remove($product);
            $em->flush();
        }


        return $this->redirectToRoute('product_index');
    }


}
