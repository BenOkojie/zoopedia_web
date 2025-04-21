'use client';
import { EmblaOptionsType,  } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import React from 'react';
import './gembla.css';

import { useEffect } from 'react';




type PropType = {
    
    slides: string[]
    options?: EmblaOptionsType
  }


const GuessCarousel: React.FC<PropType> = (props) => {
    const { slides, options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
  
    const { selectedIndex, scrollSnaps, onDotButtonClick } =
      useDotButton(emblaApi)
    useEffect(() => {
    if (emblaApi) {
        emblaApi.scrollTo(0);
    }
    }, [slides, emblaApi]);
    return (
      <section className="gembla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {slides.slice().reverse().map((item, index)=> (
              <div className="embla__slide" key={index}>
                <div className="embla__slide__number">{item}</div>
              </div>
            ))}
          </div>
        </div>
  
        <div className="embla__controls">
          <div className="embla__dots">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={'embla__dot'.concat(
                  index === selectedIndex ? ' embla__dot--selected' : ''
                )}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  export default GuessCarousel
  