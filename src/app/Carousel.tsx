'use client';

import { EmblaOptionsType,  } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import React from 'react';
import './embla.css';




type PropType = {
    
    slides: string[]
    options?: EmblaOptionsType
  }

const EmblaCarousel: React.FC<PropType> = (props) => {
    const { slides, options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
  
    const { selectedIndex, scrollSnaps, onDotButtonClick } =
      useDotButton(emblaApi)
  
    return (
      <section className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container flex ">
            {slides.slice().reverse().map((item, index) => (
              <div className="embla__slide" key={index}>
                <div className="embla__slide__number text-base sm:text-lg font-medium break-words truncate">{item}</div>
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
  
  export default EmblaCarousel
  