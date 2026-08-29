<?php

namespace App\Form;

use App\Entity\Product;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\{TextType, MoneyType, TextareaType, IntegerType, SubmitType, ChoiceType};

class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'label' => "Nombre",
                'attr' => [ 'placeholder' => 'Escribe el nombre del Producto',],
            ])
            ->add('price', MoneyType::class, [
                'currency' => 'EUR',
            ])
            ->add('description', TextareaType::class, [
                'attr' => [ 'rows' => 4]

            ]);

            if($options['is_edit']){
                $builder->add('stock', IntegerType::class, [
                'label' => "Unidades en el almacén"
                ]);
            }

            $builder->add('guardar', SubmitType::class,[
                'label' => $options['is_edit'] ? "Guardar cambios" : "Crear producto"
            ]);


    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
            'is_edit' => false,
        ]);
    }
}
