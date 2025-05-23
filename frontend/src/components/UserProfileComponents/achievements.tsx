import trophies from "@/assets/trophies-user.svg";
import { Progress } from "../ui/progress";
import medalUser from "@/assets/medal-user.png";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

function Achievements() {
  const userData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData") as string)
    : null;

  const totalXp = userData?.xp;
  const achievements = userData?.achievements ?? [];

  // Calc for level and progress bar
  const level = Math.floor(totalXp / 1000) + 1;
  const xpForNextLevel = 1000;
  const currentLevelXp = totalXp % 1000;
  const progressValue = (currentLevelXp / xpForNextLevel) * 100;

  // Configuração do carrossel com Embla
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Gerenciamento dos dots
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    // Inicializar os snaps para os dots
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="lg:w-210 flex flex-col sm:flex-row gap-3">
      {/* Nivel informations */}
      <div className="rounded-lg bg-[#F5F5F5] flex flex-col w-full justify-between px-[34px] py-[35px]">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="font-semibold text-title">Seu nível é</span>
            <span className="text-[25px] font-bold text-title text-center sm:text-start">
              {level}
            </span>
          </div>

          <img src={trophies} width={139} className="hidden sm:block" />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px]">Pontos para o próximo nível</span>
            <span className="font-bold">{`${currentLevelXp}/${xpForNextLevel} pts`}</span>
          </div>
          {/* Progress Bar */}
          <Progress value={progressValue} />
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-lg bg-[#F5F5F5] flex flex-col w-full px-[34px] py-[35px] gap-3">
        {achievements.length > 0 ? (
          <>
            {/* Carousel component */}
            <Carousel ref={emblaRef} className="select-none">
              <CarouselContent className="flex justify-center items-center gap-4">
                {achievements.map(
                  (
                    achievement: { name: string; criterion: string },
                    index: number
                  ) => (
                    <CarouselItem key={index} className="basis-1/3">
                      <div className="flex flex-col gap-2 items-center">
                        <div className="rounded-full bg-[#ECECEC] w-20 h-20 flex items-center justify-center px-5 py-3">
                          <img src={medalUser} alt={`Conquista ${index + 1}`} />
                        </div>
                        <span className="text-[12px] text-center">
                          {achievement.criterion}
                        </span>
                      </div>
                    </CarouselItem>
                  )
                )}
              </CarouselContent>
            </Carousel>

            {/* Dots navigate */}
            <div className="flex justify-center gap-2 mt-4">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === selectedIndex ? "bg-[#000]" : "bg-[#d9d9d9]"
                  }`}
                  onClick={() => emblaApi?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <span className="text-[12px] text-center">
            Nenhuma conquista encontrada
          </span>
        )}
      </div>
    </div>
  );
}

export default Achievements;
