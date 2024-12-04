import React, { useState,  useEffect  } from "react";
import Slider from "react-slick";
import "./HomePageTraveler.css";
const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0); // Track active slide
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [loading, setLoading] = useState(true); // State for loading screen visibility

  useEffect(() => {
    // Simulate loading process
    setTimeout(() => {
      setLoading(false); // Hide loading screen after 3 seconds
    }, 2000);
  }, []);

    // Function to handle image click, open modal, and set the image
  const handleImageClick = (imageSrc) => {
    setModalImage(imageSrc);
    setModalOpen(true);
  };

  // Function to handle opening the modal and setting the image to be displayed
  const openModal = (imageSrc) => {
    setModalOpen(true);
    setModalImage(imageSrc); // Set the clicked image as the modal image
  };

  // Function to handle closing the modal
  const closeModal = () => {
    setModalOpen(false);
    setModalImage(""); // Reset the modal image when closing
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (current, next) => setActiveSlide(next), // Update active slide
  };

  const slides = [
    {
      imgSrc: "123.jpg",
      stars: "★★★★",
      title: "Welcome to Modern Hotel",
      subtitle: "Indianapolis’ mornings are beautiful...",
      description: "Wake up in one of our hotel's refined rooms!",
    },
    {
      imgSrc: "3.jpg",
      stars: "★★★★",
      title: "Experience Luxury Stay",
      subtitle: "Comfort and elegance await you",
      description: "Premium rooms with world-class amenities.",
    },
    // Add more slides if needed
  ];
  const DrivingDirections = () => {}

  return (
    <>
     
  <div id="loading-screen">
    <div class="spinner"></div>
  </div>
      <section className="homeSlider-section">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="homeSlider-item">
              <div
                className="homeSlider-image"
                style={{ backgroundImage: `url(${slide.imgSrc})` }}
              >
                <div
                  className={`homeSlider-textOverlay ${
                    activeSlide === index ? "active" : ""
                  }`}
                >
                  <p className="homeSlider-stars">{slide.stars}</p>
                  <h2 className="homeSlider-title">{slide.title}</h2>
                  <h3 className="homeSlider-subtitle">{slide.subtitle}</h3>
                  <p className="homeSlider-description">{slide.description}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>
  
      {/* Section mới ở đây */}
      <section className="section-two">
        <div className="section-two-container">
          <div className="section-two-content">
            <p className="section-two-subtitle">WELCOME TO THE</p>
            <h1 className="section-two-title">Best Indianapolis Hotel!</h1>
            <p className="section-two-description">
              The Woods hotel, located at the very heart of Indianapolis, is a
              welcoming retreat both for people traveling across the country and
              for businessmen. Visiting our Rustbelt state for some commercial
              affairs? Here, we always make sure that you will have all your
              needs satisfied, be it a comfortable hotel room with a strong WiFi
              signal and diligent room service or a dining and lounge zone with
              additional amenities a traveler might want.
            </p>
            <button className="section-two-btn">Read More</button>
          </div>
          <div className="section-two-image">
            <img src="2.jpg" alt="Hotel View" />
          </div>
        </div>
      </section>
  
  {/* Section Dining & Bar */}
  <section className="dining-bar">
        <div className="dining-bar-container">
          {/* Tiêu đề cho Section Dining & Bar */}
          <div className="dining-bar-header">
            <h2 className="section-title">Dining & Bar</h2>
            <p className="section-description">
              Taste our trademark cocktails & enjoy a truly unique culinary experience... As the sun sets and the sky turns purple, we celebrate the violet hour and the end of the day before welcoming the start of the night.
            </p>
      
          </div>

          {/* Mô tả thực đơn */}
          <div className="dining-bar-menu">
            <div className="dining-bar-item">
              <h3 className="item-title">
                Crumbed Whiting <span className="item-price">$45.89</span>
              </h3>
              <p className="item-description">
                Fresh local baby whiting fillets in a sesame and parsley crumb served with chips, salad, lemon, and tartare. A delicious choice!
              </p>
            </div>

            <div className="dining-bar-item">
              <h3 className="item-title">
                Chicken Parmigiana <span className="item-price">$31.00</span>
              </h3>
              <p className="item-description">
                Chicken Surf & Turf: Char-grilled garlic chicken breast fillet topped with a garlic seafood sauce. Served with salad & fries.
              </p>
            </div>

            <div className="dining-bar-item">
              <h3 className="item-title">
                Gluten Free Surf & Turf <span className="item-price">$45.89</span>
              </h3>
              <p className="item-description">
                Char-grilled Scotch fillet, topped with garlic seafood sauce. Served with garden salad & steak fries or steamed veggies.
              </p>
            </div>

            <div className="dining-bar-item">
              <h3 className="item-title">
                Asian Noodle Salad <span className="item-price">$25.50</span>
              </h3>
              <p className="item-description">
                Julienne veggies & rice noodles with mint, coriander & cashews served with mixed leaves and sesame lime dressing.
              </p>
            </div>

            {/* Nút xem tất cả menu */}
            <div className="dining-bar-footer">
              <button className="see-all-menu-btn">See All Menu</button>
            </div>
          </div>

          {/* Tấm ảnh chủ đạo */}
          <div className="dining-bar-image-container">
            <img
              className="dining-bar-image"
              src="dining-and-bar-1-652x486.jpg" // Thay đổi ảnh chính tại đây
              alt="Dining Experience"
            />
          </div>
        </div>
      </section>
            {/* Section 4 */}
            <section className="amenities-section">
  {/* Title "A little extra..." */}
  <h2 className="amenities-title">A little extra...</h2>

  {/* Subtitle "Amenities" */}
  <h3 className="amenities-subtitle">Amenities</h3>

  {/* Description */}
  <p className="amenities-description">
    Besides our main services, we always have a lot of extra amenities to offer.
    Starting with the free parking and WiFi to a SPA center and a Conference hall,
    we can make all of your wishes come true!
  </p>

  <div className="amenities-content">
    {/* Left image */}
    <img src="jett.jpg" alt="Amenities" className="amenities-image" />

    {/* Right content */}
    <div className="amenities-right">
      <h4 className="book-suite">Book a Suite Now <br /> GET a FREE Airport Shuttle</h4>
      <p className="suite-description">
        That's correct! We're so determined to make your experience at our hotel a charm,
        that we'd love to provide you with a courtesy airport shuttle if you book with us!
      </p>
      
      <button className="book-now-btn">Book Now</button>
    </div>
  </div>
</section>
            {/* Section 5 */}
    <section class="reviews-section">
    <h2 class="section-title">Our Hotel Guests</h2>
    <div class="reviews-container">
        <div class="review">
        <img src="guest-1-96x96.jpg" alt="Martin van Buuren"/>
        <h3>Superb!</h3>
        <p>While staying in Indianapolis on my business affairs I always stay at this place. The price/quality ratio here is just outstanding, allowing me to save more money for other spends while visiting… My rating is 5 out of 5!</p>
        <p class="author">— Martin van Buuren</p>
        </div>
        <div class="review">
        <img src="guest-2-96x96.jpg" alt="Mary Johnson"/>
        <h3>Incredible!</h3>
        <p>Choosing a hotel is always challenging, especially if you're on a hectic schedule and are visiting the place for the first time. That’s why I was so happy that my guess with this hotel was definitely a lucky one.</p>
        <p class="author">— Mary Johnson</p>
        </div>
        <div class="review">
        <img src="guest-3-96x96.jpg" alt="Theodore Roosevelt"/>
        <h3>Exceptional!</h3>
        <p>I’ve been visiting Indianapolis last year while touring across the Midwest with my family. The Family room is just great, the hotel’s restaurant (and bar) are nice and overall, even the price was very reasonable…</p>
        <p class="author">— Theodore Roosevelt</p>
        </div>
    </div>
    <a href="#" class="see-all-btn">SEE ALL INFORMATIONS</a>
    </section>
        {/* Section 6 */}

        <section>
      <div>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.785013299097!2d105.81890831540132!3d21.028511893156606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abc45e717ed3%3A0x11001db88c37c98e!2zSGFub2ksIFZpZXRuYW0!5e0!3m2!1sen!2sus!4v1591177131148!5m2!1sen!2sus" 
          width="100%"
          height="450"
          style={{ border: '0' }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
      {/* Section 7 */}
    </section>
    <section className="new-image-container">
      <div className="new-image-wrapper">
        <img
          src="gallery-01-1200x800.jpg"
          alt="Image 1"
          className="new-image"
          onClick={() => openModal('gallery-01-1200x800.jpg')}
        />
      </div>
      <div className="new-image-wrapper">
        <img
          src="gallery-02-1200x800.jpg"
          alt="Image 2"
          className="new-image"
          onClick={() => openModal('gallery-02-1200x800.jpg')}
        />
      </div>
      <div className="new-image-wrapper">
        <img
          src="gallery-03-1200x800.jpg"
          alt="Image 3"
          className="new-image"
          onClick={() => openModal('gallery-03-1200x800.jpg')}
        />
      </div>
      <div className="new-image-wrapper">
        <img
          src="gallery-04-1200x800.jpg"
          alt="Image 4"
          className="new-image"
          onClick={() => openModal('gallery-04-1200x800.jpg')}
        />
      </div>
      <div className="new-image-wrapper">
        <img
          src="gallery-05-1200x800.jpg"
          alt="Image 5"
          className="new-image"
          onClick={() => openModal('gallery-05-1200x800.jpg')}
        />
      </div>
      <div className="new-image-wrapper">
        <img
          src="gallery-06-1200x800.jpg"
          alt="Image 6"
          className="new-image"
          onClick={() => openModal('gallery-06-1200x800.jpg')}
        />
      </div>
      <div className="new-image-wrapper">
        <img
          src="gallery-07-1200x800.jpg"
          alt="Image 7"
          className="new-image"
          onClick={() => openModal('gallery-07-1200x800.jpg')}
        />
      </div>
      <div className="new-image-wrapper">
        <img
          src="gallery-08-1200x800.jpg"
          alt="Image 8"
          className="new-image"
          onClick={() => openModal('gallery-08-1200x800.jpg')}
        />
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={modalImage}
              alt="Full Size"
              className="modal-image"
              style={{ width: '96px', height: '96px' }} // Fixed size of 96x96px
            />
            <span className="close-btn" onClick={closeModal}>
              X
            </span>
          </div>
        </div>
      )}
    </section>
    </>
  );
};

export default Home;
