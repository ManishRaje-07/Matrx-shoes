import React, { useState, useEffect } from 'react';
import { FiAward, FiHeart, FiSettings, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';
import styles from './About.module.css';

// Reusable Counter helper
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

export const About: React.FC = () => {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Banner */}
      <section className={styles.heroSection}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={styles.subtitle}
          >
            OUR HERITAGE
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={styles.title}
          >
            The MartX Journey
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className={styles.lead}
          >
            We don't just engineer footwear; we manufacture milestones. By combining premium athletic engineering with sleek street aesthetics, we build the support system for your achievements.
          </motion.p>
        </div>
      </section>

      {/* Brand Narrative Section */}
      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyText}>
            <span className={styles.accentText}>HOW WE STARTED</span>
            <h2>Redefining Footwear Aesthetics Since 2021</h2>
            <p>
              MartX was born in a small design studio in New York City with a singular, ambitious objective: to create a running shoe that adapts dynamically to every unique foot shape, without compromising on premium styling.
            </p>
            <p>
              Disillusioned by heavy cushioning and uniform materials that ignore individual biomechanics, our team of sports engineers and industrial designers spent two years crafting the MartX responsive midsole. The result is a line of shoes that return impact force as linear kinetic energy, reducing fatigue and propelling you forward.
            </p>
            <p>
              Today, MartX is worn by elite athletes, weekend runners, and urban professionals worldwide, standing as a testament to what happens when structural physics meets fashion design.
            </p>
          </div>
          <div className={styles.storyImageWrapper}>
            <img
              src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&auto=format&fit=crop&q=80"
              alt="MartX Designing Studio"
              className={styles.storyImg}
            />
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.valuesContainer}>
          <span className={styles.accentText} style={{ textAlign: 'center', display: 'block' }}>WHAT GUIDES US</span>
          <h2 className={styles.sectionTitle} style={{ textAlign: 'center', marginBottom: '48px' }}>Our Core Pillars</h2>

          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIconContainer}>
                <FiActivity className={styles.valueIcon} />
              </div>
              <h3>Performance First</h3>
              <p>
                Every stitch, plate, and seam is tested to ensure peak responsive kinetics. If it doesn't improve your stride, it doesn't go on the shoe.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIconContainer}>
                <FiSettings className={styles.valueIcon} />
              </div>
              <h3>Sartorial Styling</h3>
              <p>
                We believe athletic footwear should complement your outfit. Our designs feature minimalist lines, striking color balances, and premium glassmorphic overlays.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIconContainer}>
                <FiHeart className={styles.valueIcon} />
              </div>
              <h3>Eco-Conscious Woven</h3>
              <p>
                Over 70% of our knit uppers are constructed from recycled ocean plastics and organic cottons, preserving the playgrounds of the future.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIconContainer}>
                <FiAward className={styles.valueIcon} />
              </div>
              <h3>Unmatched Craft</h3>
              <p>
                We collaborate with premium manufacturers who inspect every shoe individually, verifying seam tension and density matrices before delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stat Counters Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <h3 className={styles.statVal}>
              <AnimatedCounter end={12} suffix="+" />
            </h3>
            <p className={styles.statLabel}>Industry Awards</p>
          </div>
          <div className={styles.statBox}>
            <h3 className={styles.statVal}>
              <AnimatedCounter end={250} suffix="K+" />
            </h3>
            <p className={styles.statLabel}>Shoes Manufactured</p>
          </div>
          <div className={styles.statBox}>
            <h3 className={styles.statVal}>
              <AnimatedCounter end={15} suffix="" />
            </h3>
            <p className={styles.statLabel}>Patent Registrations</p>
          </div>
          <div className={styles.statBox}>
            <h3 className={styles.statVal}>
              <AnimatedCounter end={4} suffix="M+" />
            </h3>
            <p className={styles.statLabel}>Miles Logged Globally</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
