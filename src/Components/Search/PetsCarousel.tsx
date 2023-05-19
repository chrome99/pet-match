import React, { useState, useEffect } from "react";
import "./PetsCarousel.css";
import PetCard from "./PetCard";
import { IPet } from "../Pet/PetProfile";
import { Carousel } from "react-bootstrap";
import PetsCollection from "./PetsCollection";

interface PetsCollectionProps {
  pets: IPet[];
  onClickFunction?: (pet: IPet) => void;
}

function PetsCarousel({ pets, onClickFunction }: PetsCollectionProps) {
  const [width, setWidth] = useState(window.innerWidth);
  const [index1, setIndex1] = useState(0);
  const [index2, setIndex2] = useState(0);
  const [index3, setIndex3] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div id="petsCarouselContainer">
      {width > 1000 ? (
        <Carousel
          variant="dark"
          pause={false}
          activeIndex={index1}
          onSelect={(selectedIndex, e) => {
            setIndex1(selectedIndex);
          }}
        >
          <Carousel.Item>
            <div className="petsCarouselCollection">
              <PetsCollection
                pets={[pets[0], pets[1], pets[2]]}
                onClickFunction={onClickFunction}
              />
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="petsCarouselCollection">
              <PetsCollection
                pets={[pets[3], pets[4], pets[5]]}
                onClickFunction={onClickFunction}
              />
            </div>
          </Carousel.Item>
        </Carousel>
      ) : width > 650 ? (
        <Carousel
          variant="dark"
          pause={false}
          activeIndex={index2}
          onSelect={(selectedIndex, e) => {
            setIndex2(selectedIndex);
          }}
        >
          <Carousel.Item>
            <div className="petsCarouselCollection">
              <PetsCollection
                pets={[pets[0], pets[1]]}
                onClickFunction={onClickFunction}
              />
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="petsCarouselCollection">
              <PetsCollection
                pets={[pets[2], pets[3]]}
                onClickFunction={onClickFunction}
              />
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="petsCarouselCollection">
              <PetsCollection
                pets={[pets[4], pets[5]]}
                onClickFunction={onClickFunction}
              />
            </div>
          </Carousel.Item>
        </Carousel>
      ) : width <= 650 ? (
        <Carousel
          variant="dark"
          pause={false}
          activeIndex={index3}
          onSelect={(selectedIndex, e) => {
            setIndex3(selectedIndex);
          }}
        >
          <Carousel.Item>
            <div className="petsCarouselCollection">
              <PetsCollection
                pets={[pets[0]]}
                onClickFunction={onClickFunction}
              />
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="petsCarouselCollection">
              <PetsCollection
                pets={[pets[1]]}
                onClickFunction={onClickFunction}
              />
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="petsCarouselCollection">
              <PetsCollection
                pets={[pets[2]]}
                onClickFunction={onClickFunction}
              />
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="petsCarouselCollection">
              <PetsCollection
                pets={[pets[3]]}
                onClickFunction={onClickFunction}
              />
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="petsCarouselCollection">
              <PetsCollection
                pets={[pets[4]]}
                onClickFunction={onClickFunction}
              />
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="petsCarouselCollection">
              <PetsCollection
                pets={[pets[5]]}
                onClickFunction={onClickFunction}
              />
            </div>
          </Carousel.Item>
        </Carousel>
      ) : (
        ""
      )}
    </div>
  );
}

export default PetsCarousel;
