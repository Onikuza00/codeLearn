<?php

namespace App\Repository;

use App\Entity\Tarea;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Tarea>
 */
class TareaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tarea::class);
    }

    public function findPendientes(){
        return $this->createQueryBuilder('n')
        ->andWhere('n.done = :valor')
        ->setParameter('valor', false)
        ->orderBy('n.createdAt', 'DESC')
        ->getQuery()
        ->getResult()
        ;
    }

     public function findByTitle(string $texto){
        return $this->createQueryBuilder('n')
        ->andWhere('n.title LIKE :titulo')
        ->setParameter('titulo', '%' . $texto . '%')
        ->orderBy('n.title', 'DESC')
        ->getQuery()
        ->getResult()
        ;
    }
}
