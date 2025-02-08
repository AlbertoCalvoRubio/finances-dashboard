import { Account } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

type AccountsCarouselProps = {
  accounts: Account[];
};

export default function AccountsCarousel({ accounts }: AccountsCarouselProps) {
  return (
    <Carousel className="w-full">
      <CarouselContent className="">
        {accounts.length > 0 ? (
          accounts.map(({ id, alias, balance, iban }) => (
            <CarouselItem
              key={id}
              className="min-w-[240px] md:basis-1/2 lg:basis-1/3"
            >
              <div className="pl-1">
                <Card>
                  <CardHeader>
                    <CardTitle>{alias}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <p>IBAN: {iban}</p>
                      <p>Balance: {balance} CHF</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))
        ) : (
          <CarouselItem className="md:basis-1/2 lg:basis-1/3">
            <div className="pl-1">
              <Card className="h-[125px] w-[240px] rounded-xl" />
            </div>
          </CarouselItem>
        )}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
