'use client';
import { CheckCircle } from 'lucide-react';
import BuyButton from '../payments/buy-button';
import { usePlans } from '@/lib/hooks/queries';
import { Plan } from '@/types/database-types';

const PriceCard = ({
    name,
    price,
    stripe_price_id,
    features,
    highlighted,
}: {
    name: string;
    price: string;
    stripe_price_id: string;
    features: string[];
    highlighted: boolean;
}) => {
    return (
        <div
            className={`relative max-w-full border rounded-lg p-8 flex flex-col min-h-full ${highlighted ? 'border-2 border-blue-500 shadow-2xl' : 'shadow-lg'
                } transition-all transform hover:scale-105`}
        >
            {highlighted && (
                <span className="absolute top-[-12px] left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">
                    Mais Popular
                </span>
            )}

            <h2 className="text-xl font-semibold text-primary mb-2">{name}</h2>
            <p className="text-3xl font-bold text-primary mb-6">{`${price}`}</p>

            <ul className="text-left space-y-3 text-primary flex-grow">
                {features?.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center">
                        <CheckCircle className="mr-2 text-green-500" size={16} />
                        <span className="text-sm">{feature}</span>
                    </li>
                ))}
            </ul>

            <div className="flex justify-center items-end top-0 mt-6">
                <BuyButton priceId={stripe_price_id} planName={name} />
            </div>
        </div>
    );
};

const PlanCards = () => {
    const { data: plans } = usePlans();

    if (plans?.length === 0 || !plans) {
        return <div>Nenhum plano encontrado</div>;
    }

    const highlightedPlan = plans.find((plan: Plan) => plan.name === 'Plano Avançado');
    const remainingPlans = plans.filter((plan: Plan) => plan.name !== 'Plano Avançado');

    return (
        <div className="flex md:flex-row flex-col justify-center gap-14">
            <div className="flex justify-start flex-1">
                {remainingPlans[0] && (
                    <PriceCard {...remainingPlans[0]} highlighted={false} />
                )}
            </div>
            <div className="flex justify-center flex-1">
                {highlightedPlan && (
                    <PriceCard {...highlightedPlan} highlighted={true} />
                )}
            </div>
            <div className="flex justify-end flex-1">
                {remainingPlans[1] && (
                    <PriceCard {...remainingPlans[1]} highlighted={false} />
                )}
            </div>
        </div>
    );
};

export default PlanCards;
