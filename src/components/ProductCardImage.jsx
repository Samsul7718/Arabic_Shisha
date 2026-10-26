import React, { useState } from 'react';

/**
 * ProductCardImage component that provides a smooth sliding transition
 * to show a product's secondary image when hovering over the card.
 * Supports contain/cover objectFit, customizable container height,
 * and clear downside flavour name display.
 */
export const ProductCardImage = ({
  primaryImage,
  secondaryImage,
  alt = 'Product image',
  height = '280px',
  isOutOfStock = false,
  brand = null,
  stockBadge = null,
  lang = 'en',
  onImageClick = null,
  objectFit = 'contain',
  flavorName = null,
  flavorProfile = null
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Fallback for secondary image if missing or identical
  const secondImg =
    secondaryImage && secondaryImage !== primaryImage
      ? secondaryImage
      : primaryImage === 'https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?auto=format&fit=crop&w=600&q=80'
      ? 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80';

  const hasSecondary = Boolean(secondImg);

  return (
    <div
      className="card-image-slider-wrapper"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onImageClick}
      style={{
        position: 'relative',
        height,
        width: '100%',
        overflow: 'hidden',
        cursor: onImageClick ? 'pointer' : 'default',
        userSelect: 'none',
        background: 'radial-gradient(circle at center, rgba(32, 38, 54, 0.95) 0%, rgba(11, 13, 18, 1) 100%)'
      }}
    >
      {/* Sliding Image Track */}
      <div
        className="card-image-slider-track"
        style={{
          display: 'flex',
          width: hasSecondary ? '200%' : '100%',
          height: '100%',
          transform: isHovered && hasSecondary ? 'translateX(-50%)' : 'translateX(0%)',
          transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        {/* Primary Image View */}
        <div
          style={{
            width: hasSecondary ? '80%' : '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: objectFit === 'contain' ? '8px 10px' : 0
          }}
        >
          <img
            src={primaryImage}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit,
              objectPosition: 'center',
              filter: isOutOfStock ? 'grayscale(80%)' : 'none',
              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          />
        </div>

        {/* Secondary Image View (Slides in on hover) */}
        {hasSecondary && (
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: objectFit === 'contain' ? '8px 10px' : 0
            }}
          >
            <img
              src={secondImg}
              alt={`${alt} alternate angle`}
              style={{
                width: '100%',
                height: '100%',
                objectFit,
                objectPosition: 'center',
                filter: isOutOfStock ? 'grayscale(80%)' : 'none',
                transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
            />
          </div>
        )}
      </div>

      {/* Subtle edge vignette (does not black out bottom packaging text) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(11, 13, 18, 0.3) 0%, transparent 20%, transparent 80%, rgba(11, 13, 18, 0.35) 100%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Brand Tag Top Left */}
      {/* {brand && (
        <span
          style={{
            position: 'absolute',
            top: '12px',
            left: lang === 'ar' ? 'auto' : '12px',
            right: lang === 'ar' ? '12px' : 'auto',
            background: 'rgba(212, 175, 55, 0.28)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid var(--border-gold)',
            color: 'var(--accent-gold-light)',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '2px 9px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            zIndex: 2
          }}
        >
          {brand}
        </span>
      )} */}

      {/* Stock Status Badge stacked cleanly under Brand Tag */}
      {stockBadge && (
        <div
          style={{
            position: 'absolute',
            top: brand ? '12px' : '12px',
            left: lang === 'ar' ? 'auto' : '12px',
            right: lang === 'ar' ? '12px' : 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            zIndex: 2
          }}
        >
          {stockBadge}
        </div>
      )}

      {/* Slide Indicator Dots & Hover Pill */}
      {hasSecondary && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: lang === 'ar' ? 'auto' : '12px',
            left: lang === 'ar' ? '12px' : 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            padding: '4px 8px',
            borderRadius: '12px',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            zIndex: 2,
            transition: 'all 0.3s ease',
            pointerEvents: 'none'
          }}
        >
          <span
            style={{
              width: isHovered ? '5px' : '12px',
              height: '5px',
              borderRadius: '3px',
              backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.4)' : 'var(--accent-gold)',
              transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          />
          <span
            style={{
              width: isHovered ? '12px' : '5px',
              height: '5px',
              borderRadius: '3px',
              backgroundColor: isHovered ? 'var(--accent-gold)' : 'rgba(255, 255, 255, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
          />
          <span
            style={{
              fontSize: '0.65rem',
              color: 'var(--accent-gold-light)',
              fontWeight: 600,
              marginLeft: '2px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}
          >
            {isHovered ? (lang === 'ar' ? 'منظر 2' : 'View 2') : (lang === 'ar' ? 'اسحب' : 'Slide')}
          </span>
        </div>
      )}

      {/* Flavor Name Banner at Down Side of Image */}
      {/* {flavorName && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(11, 13, 18, 0.95) 0%, rgba(19, 23, 34, 0.82) 70%, rgba(19, 23, 34, 0.1) 100%)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            borderTop: '1px solid rgba(212, 175, 55, 0.3)',
            padding: '7px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            zIndex: 3,
            pointerEvents: 'none'
          }} */}
        {/* > */}
          {/* <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}> */}
            {/* <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--accent-gold)',
                boxShadow: '0 0 8px var(--accent-gold)',
                flexShrink: 0
              }} */}
            {/* /> */}
             {/* <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.3px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textShadow: '0 1px 4px rgba(0,0,0,0.9)'
              }}
            > 
               {flavorName}
             </span>  */}
          {/* </div> */}

          {/* {flavorProfile && ( */}
             {/* <span */}
               {/* style={{ */}
            {/* //     fontSize: '0.68rem',
            //     fontWeight: 700,
            //     color: 'var(--accent-gold-light)',
            //     background: 'rgba(212, 175, 55, 0.2)',
            //     border: '1px solid var(--border-gold)',
            //     padding: '2px 7px',
            //     borderRadius: 'var(--radius-full)',
            //     whiteSpace: 'nowrap',
            //     flexShrink: 0 */}
            {/* //   }} */}
            {/* // > */}
              {/* {flavorProfile} */}
            {/* // </span> */}
          {/* // )} */}
       {/* </div> */}
      {/* // )} */}
    </div>
  );
};
