"use client";
import React from "react";
import clsx from "clsx";
import Link from "next/link";

/**
 * Enhanced CustomButton component for Plivix Technologies
 * 
 * Props:
 * - variant: 'solid' | 'glass' | 'outline' | 'gradient' | 'glow' | 'minimal' | 'floating' | 'pulse' | 'shimmer' | 'neon'
 * - size: 'sm' | 'md' | 'lg' | 'xl'
 * - className: optional additional Tailwind CSS classes
 * - children: button content
 * - icon: optional icon component
 * - iconPosition: 'left' | 'right'
 * - loading: boolean for loading state
 * - ...props: other button props (e.g. href, onClick)
 */
const Button = ({
  variant = "solid",
  size = "md",
  className = "",
  children,
  link,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "right",
  ...props
}) => {
  // Size configurations
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };

  // Base styles for all buttons
  const baseStyles = clsx(
    "relative cursor-pointer rounded-lg flex items-center justify-center gap-2 font-semibold transition-all duration-300 transform overflow-hidden group",
    "focus:outline-none focus:ring-4 focus:ring-primary/30",
    "disabled:cursor-not-allowed",
    sizes[size]
  );

  // Button variants with enhanced animations
  const variants = {
    // Original solid variant with enhancements
    solid: clsx(
      "bg-gradient-to-r from-dark-blue to-primary text-white shadow-lg border-t border-b border-dark-blue",
      "hover:from-primary hover:to-dark-blue hover:scale-105 hover:shadow-xl hover:shadow-primary/25",
      "active:scale-95 active:shadow-md",
      // Shine effect on hover
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
      "before:transform before:-skew-x-12 before:-translate-x-full before:transition-transform before:duration-700",
      "hover:before:translate-x-full"
    ),

    // Enhanced glass variant
    glass: clsx(
      "bg-dark-blue/10 backdrop-blur-md text-dark-blue border border-dark-blue/30",
      "hover:bg-dark-blue/20 hover:border-dark-blue/50 hover:scale-105 hover:shadow-lg hover:shadow-dark-blue/20",
      "active:scale-95",
      // Glass reflection effect
      "before:absolute before:top-0 before:left-0 before:w-full before:h-1/2 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:opacity-0",
      "hover:before:opacity-100 before:transition-opacity before:duration-300"
    ),

    // Outline variant
    outline: clsx(
      "bg-transparent text-dark-blue border-2 border-dark-blue",
      "hover:bg-dark-blue hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-dark-blue/25",
      "active:scale-95",
      // Border animation
      "before:absolute before:inset-0 before:border-2 before:border-primary before:rounded-lg before:scale-0",
      "hover:before:scale-100 before:transition-transform before:duration-300"
    ),

    // Enhanced gradient variant
    gradient: clsx(
      "bg-gradient-to-r from-primary via-dark-blue to-primary text-white shadow-lg",
      "hover:shadow-2xl hover:shadow-primary/30 hover:scale-105",
      "active:scale-95",
      // Animated gradient background
      "bg-[length:200%_100%] hover:bg-right-top transition-[background-position,transform,box-shadow] duration-500",
      // Glow effect
      "after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-r after:from-primary after:to-dark-blue after:opacity-0 after:blur-xl after:-z-10",
      "hover:after:opacity-50 after:transition-opacity after:duration-500"
    ),

    // Glowing variant
    glow: clsx(
      "bg-gradient-to-r from-dark-blue to-primary text-white shadow-lg",
      "hover:scale-105 hover:shadow-2xl hover:shadow-primary/50",
      "active:scale-95",
      // Pulsing glow effect
      "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-primary before:to-dark-blue before:opacity-0 before:blur-xl before:-z-10",
      "hover:before:opacity-75 hover:before:animate-pulse before:transition-opacity before:duration-300",
      // Inner highlight
      "after:absolute after:inset-[1px] after:rounded-lg after:bg-gradient-to-r after:from-white/20 after:to-transparent after:opacity-0",
      "hover:after:opacity-100 after:transition-opacity after:duration-300"
    ),

    // Minimal variant
    minimal: clsx(
      "bg-transparent text-dark-blue",
      "hover:bg-primary/10 hover:scale-105 hover:text-primary",
      "active:scale-95",
      // Underline animation
      "before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-primary",
      "hover:before:w-full before:transition-all before:duration-300"
    ),

    // Floating variant
    floating: clsx(
      "bg-white text-dark-blue shadow-lg border border-gray-200",
      "hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 hover:scale-105",
      "active:translate-y-0 active:scale-95",
      // Floating shadow animation
      "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-primary/20 before:to-dark-blue/20 before:opacity-0 before:blur-xl before:-z-10",
      "hover:before:opacity-100 before:transition-opacity before:duration-500"
    ),

    // Pulse variant
    pulse: clsx(
      "bg-gradient-to-r from-primary to-dark-blue text-white shadow-lg",
      "hover:scale-105 hover:shadow-xl hover:shadow-primary/30",
      "active:scale-95",
      // Ripple effect
      "before:absolute before:inset-0 before:rounded-lg before:bg-white before:opacity-0 before:scale-0",
      "hover:before:opacity-20 hover:before:scale-100 hover:before:animate-ping before:transition-all before:duration-500"
    ),

    // Shimmer variant
    shimmer: clsx(
      "bg-gradient-to-r from-dark-blue via-primary to-dark-blue text-white shadow-lg relative",
      "hover:scale-105 hover:shadow-xl hover:shadow-primary/30",
      "active:scale-95",
      // Shimmer effect
      "bg-[length:200%_100%] animate-shimmer hover:animate-none",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent",
      "before:transform before:-skew-x-12 before:-translate-x-full",
      "hover:before:translate-x-full before:transition-transform before:duration-1000"
    ),

    // Neon variant
    neon: clsx(
      "bg-dark-blue text-primary border-2 border-primary shadow-lg",
      "hover:text-white hover:bg-primary hover:scale-105",
      "active:scale-95",
      // Neon glow effect
      "shadow-primary/50 hover:shadow-2xl hover:shadow-primary/75",
      // Neon border animation
      "before:absolute before:inset-0 before:rounded-lg before:border-2 before:border-primary before:opacity-0",
      "hover:before:opacity-100 hover:before:animate-pulse before:transition-opacity before:duration-300",
      // Inner neon glow
      "after:absolute after:inset-1 after:rounded-lg after:bg-primary/10 after:opacity-0",
      "hover:after:opacity-100 after:transition-opacity after:duration-300"
    )
  };

  // Disabled state
  const disabledStyles = "opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none";

  // Loading state
  const loadingStyles = "cursor-wait";

  const ButtonContent = ({ isLoading }) => (
    <>
      {/* Loading Spinner */}
      {isLoading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      
      {/* Left Icon */}
      {icon && iconPosition === "left" && !isLoading && (
        <span className="transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
      )}
      
      {/* Button Text */}
      <span className="flex items-center gap-2 justify-center font-semibold">
        {isLoading ? "Loading..." : children}
      </span>
      
      {/* Right Icon */}
      {icon && iconPosition === "right" && !isLoading && (
        <span className="transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-1">
          {icon}
        </span>
      )}
    </>
  );

  const ButtonComponent = () => {
    return (
      <button
        className={clsx(
          baseStyles,
          variants[variant],
          disabled && disabledStyles,
          loading && loadingStyles,
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        <ButtonContent isLoading={loading} />
      </button>
    );
  };

  return (
    <>
      {link && !disabled && !loading ? (
        <Link href={link} className="inline-block">
          <ButtonComponent />
        </Link>
      ) : (
        <ButtonComponent />
      )}
    </>
  );
};

export default Button;

/* 
ADD THIS TO YOUR TAILWIND.CONFIG.JS:

module.exports = {
  content: [...],
  theme: {
    extend: {
      colors: {
        'primary': '#3B82F6',
        'dark-blue': '#1E40AF',
        'primary-white': '#F8FAFC',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' },
        },
        'pulse-glow': {
          '0%': { 'box-shadow': '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { 'box-shadow': '0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(59, 130, 246, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}

USAGE EXAMPLES:

// Basic usage
<Button variant="solid">Click Me</Button>

// With icon
<Button variant="glow" icon={<ArrowRight className="w-4 h-4" />}>
  Get Started
</Button>

// With link
<Button variant="shimmer" link="/contact" size="lg">
  Contact Us
</Button>

// Loading state
<Button variant="gradient" loading={true}>
  Processing...
</Button>

// Disabled state  
<Button variant="outline" disabled={true}>
  Disabled
</Button>

// Different sizes
<Button variant="neon" size="xl">
  Large Button
</Button>

// Custom styling
<Button 
  variant="floating" 
  className="w-full"
  icon={<Download className="w-4 h-4" />}
  iconPosition="left"
>
  Download Now
</Button>
*/