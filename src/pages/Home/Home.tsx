import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCheck, FiChevronDown, FiShield, FiTruck, FiRefreshCw, FiStar } from 'react-icons/fi';
import styles from './Home.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Helper component for animated counters
const AnimatedCounter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({
  end,
  suffix = '',
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

// FAQ Data
interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is MartX's return policy?",
    answer: "We offer a 30-day hassle-free return policy on all unworn shoes in their original packaging. Return shipping labels are fully prepaid and provided on request.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and times are calculated automatically at checkout based on your destination.",
  },
  {
    question: "How do I find my correct size?",
    answer: "Our shoes generally run true to size. If you are between sizes, we recommend ordering the half-size larger for running models, or referring to the Size Chart on each product details view.",
  },
  {
    question: "Are MartX running shoes suitable for flat feet?",
    answer: "Absolutely! Models such as the Quantum Boost and Infinite Run incorporate dual-density medial posts that provide elite pronation correction and arch support.",
  },
  {
    question: "How long does standard shipping take?",
    answer: "Standard shipping takes 3-5 business days. Express shipping (1-2 business days) is also available. Orders over $150 qualify for free standard shipping automatically.",
  },
];

// Testimonials Data
interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Liam Kendrick",
    role: "Sneaker Enthusiast",
    quote: "The style and cushioning are out of this world. I've bought three pairs of MartX shoes, and they are easily the best sneakers in my closet. The design turns heads everywhere I go.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Marcus Thompson",
    role: "Professional Trainer",
    quote: "As a professional trainer, I demand both support and durability from my training gear. The Zenith Fit series excels in lateral stabilization and has become my daily go-to at the gym.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    role: "Marathon Runner",
    quote: "I completed my third full marathon wearing the MartX Aero Glide. Zero blisters, no sore knees. The energy feedback from the carbon plate is incredible and cut my PR by minutes!",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
];

export const Home: React.FC = () => {
  const { products, addToast } = useShop();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [email, setEmail] = useState('');

  // Extract featured products
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);

  const toggleFaq = (idx: number) => {
    setActiveFaq((prev) => (prev === idx ? null : idx));
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter an email address.', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        addToast('Thank you for subscribing to our newsletter!', 'success');
        setEmail('');
      } else {
        const data = await response.json();
        addToast(data.error || 'Subscription failed. Please try again.', 'error');
      }
    } catch {
      addToast('Failed to connect to subscription server.', 'error');
    }
  };

  const heroSlides = [
    {
      id: 1,
      title: 'AERO GLIDE: DEFINE YOUR PACE',
      subtitle: 'LIMITLESS PERFORMANCE',
      desc: 'Engineered with revolutionary carbon-fiber propulsion plate technology and featherlight woven mesh.',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&auto=format&fit=crop&q=80',
      link: '/product/1',
    },
    {
      id: 2,
      title: 'QUANTUM BOOST: CHASE ENERGY',
      subtitle: 'REBOUND DYNAMICS',
      desc: 'Thousands of high-elasticity foam capsules return dynamic force with every steps you take.',
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&auto=format&fit=crop&q=80',
      link: '/product/2',
    },
    {
      id: 3,
      title: 'LEGACY LEATHER: RETRO LUXURY',
      subtitle: 'CRAFTED COMFORT',
      desc: 'Hand-stitched premium full-grain Italian leather matched with an orthopedic custom cork support footbed.',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&auto=format&fit=crop&q=80',
      link: '/product/8',
    },
  ];

  return (
    <div className={styles.home}>
      {/* 1. Animated Hero Section */}
      <section className={styles.heroSection}>
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className={styles.heroSwiper}
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id} className={styles.slide}>
              <div
                className={styles.slideBg}
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className={styles.slideOverlay} />
              <div className={styles.slideContent}>
                <div className={styles.textContainer}>
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className={styles.slideSubtitle}
                  >
                    {slide.subtitle}
                  </motion.span>
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={styles.slideTitle}
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className={styles.slideDesc}
                  >
                    {slide.desc}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <Link to={slide.link} className={styles.heroBtn}>
                      <span>Explore Collection</span>
                      <FiArrowRight />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 2. Value Features / Badges Grid */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <div className={styles.featureItem}>
            <div className={styles.featureIconContainer}>
              <FiTruck className={styles.featureIcon} />
            </div>
            <div>
              <h3 className={styles.featureTitle}>Free Express Shipping</h3>
              <p className={styles.featureText}>On orders over $150 worldwide</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIconContainer}>
              <FiRefreshCw className={styles.featureIcon} />
            </div>
            <div>
              <h3 className={styles.featureTitle}>30-Day Returns</h3>
              <p className={styles.featureText}>Prepaid labels, hassle-free returns</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIconContainer}>
              <FiShield className={styles.featureIcon} />
            </div>
            <div>
              <h3 className={styles.featureTitle}>Secure Payments</h3>
              <p className={styles.featureText}>PCI compliant checkout system</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className={styles.featuredSection}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionHeaderInfo}>
            <span className={styles.sectionSubtitle}>CURATED EXCELLENCE</span>
            <h2 className={styles.sectionTitle}>Featured Collections</h2>
          </div>
          <Link to="/shop" className={styles.seeAllLink}>
            <span>View All Shoes</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className={styles.featuredGrid}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Stats Counter Grid */}
      <section className={styles.statsSection}>
        <div className={styles.statsBgOverlay} />
        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <h3 className={styles.statVal}>
              <AnimatedCounter end={150} suffix="K+" />
            </h3>
            <p className={styles.statLabel}>Happy Athletes</p>
          </div>
          <div className={styles.statBox}>
            <h3 className={styles.statVal}>
              <AnimatedCounter end={24} suffix="+" />
            </h3>
            <p className={styles.statLabel}>Premium Styles</p>
          </div>
          <div className={styles.statBox}>
            <h3 className={styles.statVal}>
              <AnimatedCounter end={18} suffix="+" />
            </h3>
            <p className={styles.statLabel}>Global Stores</p>
          </div>
          <div className={styles.statBox}>
            <h3 className={styles.statVal}>
              <AnimatedCounter end={99} suffix="%" />
            </h3>
            <p className={styles.statLabel}>Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* 5. Testimonials Slider */}
      <section className={styles.testimonialsSection}>
        <span className={styles.sectionSubtitle} style={{ textAlign: 'center', display: 'block' }}>WHAT RUNNERS SAY</span>
        <h2 className={styles.sectionTitle} style={{ textAlign: 'center', marginBottom: '40px' }}>Athlete Endorsements</h2>
        
        <div className={styles.testimonialsContainer}>
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            spaceBetween={30}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }}
            className={styles.testimonialsSwiper}
          >
            {testimonials.map((test) => (
              <SwiperSlide key={test.id}>
                <div className={styles.testimonialCard}>
                  <div className={styles.ratingRow}>
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <FiStar key={i} className={styles.starActive} />
                    ))}
                  </div>
                  <p className={styles.quote}>"{test.quote}"</p>
                  <div className={styles.avatarRow}>
                    <img src={test.image} alt={test.name} className={styles.avatar} />
                    <div>
                      <h4 className={styles.avatarName}>{test.name}</h4>
                      <p className={styles.avatarRole}>{test.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 6. FAQ Accordion */}
      <section className={styles.faqSection}>
        <span className={styles.sectionSubtitle} style={{ textAlign: 'center', display: 'block' }}>GOT QUESTIONS?</span>
        <h2 className={styles.sectionTitle} style={{ textAlign: 'center', marginBottom: '40px' }}>Frequently Asked Questions</h2>
        
        <div className={styles.faqContainer}>
          {faqs.map((faq, idx) => (
            <div key={idx} className={styles.faqItem}>
              <button
                onClick={() => toggleFaq(idx)}
                className={`${styles.faqTrigger} ${activeFaq === idx ? styles.faqTriggerActive : ''}`}
              >
                <span className={styles.faqQuestion}>{faq.question}</span>
                <FiChevronDown
                  className={`${styles.faqChevron} ${activeFaq === idx ? styles.chevronRotate : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={styles.faqContent}
                  >
                    <p className={styles.faqAnswer}>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Newsletter Section */}
      <section className={styles.newsletterSection}>
        <div className={styles.newsletterCard}>
          <h2 className={styles.newsTitle}>Join the MartX Club</h2>
          <p className={styles.newsText}>
            Subscribe to get early access to exclusive drops, premium product releases, and 10% off your first purchase.
          </p>
          <form onSubmit={handleNewsletterSubmit} className={styles.newsForm}>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.newsInput}
              />
              <button type="submit" className={styles.newsSubmitBtn}>
                <span>Subscribe</span>
                <FiCheck size={18} />
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
