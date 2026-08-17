<?php

namespace App\Form;

use App\Entity\Tarea;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\{TextType, SubmitType, ChoiceType};

class TareaType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'label' => "Titulo de la Tarea",
                'required' => true,
            ])
            ->add('guardar', SubmitType::class, [
                'label' => "Guardar tarea",
                'attr' => [
                    'class' => "btn-save"
                ]
            ]);

        if($options['edicion'])
            $builder->add('done', ChoiceType::class, [
                'choices' => (['Pendiente' => false, "Hecha" => true]),
                'expanded' => true,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Tarea::class,
            'edicion' => false,
        ]);
    }
}
