import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    title: 'Khám phá công nghệ',
    subtitle: 'Laptop mới nhất',
    description: 'Hàng loạt laptop hiệu năng cao từ Apple, Dell, HP với ưu đãi lên đến 20%.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop',
    primaryButtonText: 'Mua ngay',
    primaryButtonLink: '/products',
    secondaryButtonText: 'Xem ưu đãi',
    secondaryButtonLink: '/deals',
  },
  {
    id: 2,
    title: 'Nâng cấp setup',
    subtitle: 'PC & Màn hình',
    description: 'Tăng hiệu suất làm việc và giải trí với PC gaming và màn hình 4K chất lượng cao.',
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    primaryButtonText: 'Khám phá PC',
    primaryButtonLink: '/categories/pc',
    secondaryButtonText: 'Xem màn hình',
    secondaryButtonLink: '/categories/monitor',
  },
  {
    id: 3,
    title: 'Ưu đãi công nghệ',
    subtitle: 'Giảm giá sốc',
    description: 'Tiết kiệm lớn với các sản phẩm công nghệ từ laptop, PC đến phụ kiện trong tuần này.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop',
    primaryButtonText: 'Xem ưu đãi',
    primaryButtonLink: '/deals',
    secondaryButtonText: 'Danh mục',
    secondaryButtonLink: '/categories',
  },
];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progressWidth, setProgressWidth] = useState(0);
  const autoPlayDuration = 6000;
  const totalSlides = slides.length;

  // Auto-advance slides and progress bar
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let progressInterval: ReturnType<typeof setInterval>;

    if (isAutoPlaying) {
      progressInterval = setInterval(() => {
        setProgressWidth(prev => {
          if (prev >= 100) return 0;
          return prev + (100 / (autoPlayDuration / 60));
        });
      }, 60);

      interval = setInterval(() => {
        setCurrentSlide(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
        setProgressWidth(0);
      }, autoPlayDuration);
    }

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isAutoPlaying, totalSlides]);

  // Pause autoplay when user interacts
  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    pauseAutoPlay();
    setProgressWidth(0);
    setCurrentSlide(prev => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    pauseAutoPlay();
    setProgressWidth(0);
    setCurrentSlide(prev => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    pauseAutoPlay();
    setProgressWidth(0);
    setCurrentSlide(index);
  };

  // Framer Motion variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.2, duration: 0.5 },
    }),
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, rotate: -8 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: -3,
      transition: {
        duration: 0.6,
        type: 'spring',
        stiffness: 100,
      },
    },
    hover: {
      rotate: 0,
      scale: 1.02,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 overflow-hidden">
      {/* Background SVG patterns */}
      <motion.div
        className="absolute inset-0 z-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="dotPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotPattern)" />
        </svg>
      </motion.div>

      {/* Carousel content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[450px] md:min-h-[550px]">
          {/* Left: Text with AnimatePresence for smooth transitions */}
          <div className="flex flex-col justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${currentSlide}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ staggerChildren: 0.1 }}
                className="flex flex-col"
              >
                <motion.h1
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
                  variants={textVariants}
                  custom={0}
                >
                  {slides[currentSlide].title} <br />
                  <motion.span
                    className="text-yellow-300"
                    variants={textVariants}
                    custom={1}
                  >
                    {slides[currentSlide].subtitle}
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="mt-4 text-white text-opacity-90 text-lg max-w-md"
                  variants={textVariants}
                  custom={2}
                >
                  {slides[currentSlide].description}
                </motion.p>

                <motion.div
                  className="mt-8 flex flex-wrap gap-4"
                  variants={textVariants}
                  custom={3}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to={slides[currentSlide].primaryButtonLink}
                      className="px-6 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors shadow-lg"
                    >
                      {slides[currentSlide].primaryButtonText}
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      to={slides[currentSlide].secondaryButtonLink}
                      className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white hover:bg-opacity-10 transition-colors"
                    >
                      {slides[currentSlide].secondaryButtonText}
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="mt-6 flex items-center text-sm text-white"
                  variants={textVariants}
                  custom={4}
                >
                  <motion.div
                    className="flex -space-x-2 mr-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    {[44, 46, 45].map((id, index) => (
                      <motion.img
                        key={id}
                        className="w-8 h-8 rounded-full border-2 border-white"
                        src={`https://randomuser.me/api/portraits/${index === 1 ? 'men' : 'women'}/${id}.jpg`}
                        alt="User"
                        initial={{ opacity: 0, scale: 0.8, x: -5 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.2 }}
                      />
                    ))}
                  </motion.div>
                  <span className="text-white text-opacity-90">10,000+ khách hàng tin dùng</span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Image with AnimatePresence */}
          <div className="relative ml-auto w-full hidden md:flex">
            <AnimatePresence mode="wait">
              <motion.div
                key={`image-${currentSlide}`}
                className="relative z-20"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover="hover"
              >
                <img
                  src={slides[currentSlide].imageUrl}
                  alt={slides[currentSlide].title}
                  className="rounded-2xl shadow-2xl w-full object-cover h-64 md:h-80"
                />
                <motion.div
                  className="absolute top-4 right-4 bg-yellow-400 text-blue-900 rounded-full px-4 py-2 font-bold text-sm transform rotate-12 shadow-lg"
                  initial={{ opacity: 0, scale: 0, rotate: 30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 12 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  Sale 20%
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Progress dots with current progress indicator */}
        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center space-y-4 z-30">
          {/* Progress bar for current slide */}
          <div className="w-32 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              style={{ width: `${progressWidth}%` }}
            />
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center space-x-3">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors flex items-center justify-center`}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className={`w-full h-full rounded-full ${currentSlide === index ? 'bg-white' : 'bg-white/40'}`}
                  animate={{
                    scale: currentSlide === index ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    repeat: currentSlide === index ? Infinity : 0,
                    duration: 2,
                  }}
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Navigation arrows with animation */}
        <motion.button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm z-30 transition-all md:left-8"
          aria-label="Previous slide"
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.3)' }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaArrowLeft />
        </motion.button>

        <motion.button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm z-30 transition-all md:right-8"
          aria-label="Next slide"
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.3)' }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaArrowRight />
        </motion.button>
      </div>
      <div className="relative bottom-0 left-0 right-0 transform translate-y-1 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#f9fafb"
            fillOpacity="1"
            d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,138.7C672,139,768,181,864,181.3C960,181,1056,139,1152,138.7C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default Banner;