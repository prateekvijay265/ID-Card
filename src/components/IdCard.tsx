import QRCode from 'react-qr-code';
import Barcode from 'react-barcode';
import { type CardData } from '../canvasRenderer';

interface IdCardProps {
  data: CardData;
  userPhoto: string | null;
}

const CARD_WIDTH = 682;
const CARD_HEIGHT = 1024;
const GREEN = '#073629';

/*
 * IMPORTANT:
 * This is the transparent master artwork. The clean/opaque version must NOT
 * be used here because it covers the circular photo opening.
 */
const TEMPLATE = '/new_card_bg_transparent.png';

function fitTextSize(
  text: string,
  maxChars: number,
  large: number,
  small: number,
) {
  if (text.length <= maxChars) return large;
  if (text.length <= maxChars + 8) return Math.max(small, large - 2);
  return small;
}

function stackItems(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 5);
}

export default function IdCard({ data, userPhoto }: IdCardProps) {
  const name = (data.name || 'YOUR NAME').trim();
  const title = (data.builderTitle || 'ALGORITHM NAVIGATOR').trim();
  const subtext = (
    data.builderSubtext ||
    'Turning logic into impact, one line at a time.'
  ).trim();

  const items = stackItems(
    data.stackRoleList || 'Entry 1, Entry 2',
  );

  return (
    <div
      id="id-card-node"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        position: 'relative',
        overflow: 'hidden',
        background: '#F1F2E5',
        flexShrink: 0,
        fontFamily: '"Space Mono", monospace',
      }}
    >
      {/* =========================================================
          PHOTO
          The transparent master has its circular opening around
          x=347..621 / y=175..476.
         ========================================================= */}
      {userPhoto && (
        <div
          style={{
            position: 'absolute',
            left: 348,
            top: 181,
            width: 286,
            height: 286,
            borderRadius: '50%',
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          <img
            src={userPhoto}
            alt="Builder"
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: '50% 50%',
            }}
          />
        </div>
      )}

      {/* =========================================================
          MASTER ARTWORK
          Never replace this with the clean/opaque template.
         ========================================================= */}
      <img
        src={TEMPLATE}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          zIndex: 2,
          display: 'block',
          pointerEvents: 'none',
        }}
      />

      {/* =========================================================
          DYNAMIC CONTENT ONLY
         ========================================================= */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          pointerEvents: 'none',
          color: GREEN,
        }}
      >
        {/* NAME
            The NAME brush stroke and outer box are already in the
            master artwork. Only the value is rendered. */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 382,
            width: 263,
            height: 75,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 10px',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              color: GREEN,
              fontFamily: '"Arial Narrow", "Bebas Neue", Impact, sans-serif',
              fontSize: fitTextSize(name, 16, 28, 20),
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: '0.15px',
              textTransform: 'uppercase',
              maxWidth: '100%',
              overflowWrap: 'anywhere',
            }}
          >
            {name}
          </div>
        </div>

        {/* STACK / ROLE
            The transparent master contains a temporary helper sentence
            ("YAHAN PE ENTRY KARNI HAI"). Cover only that sentence, while
            leaving the border/header/artwork untouched. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 48,
            top: 602,
            width: 266,
            height: 66,
            background: '#F1F2E5',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 42,
            top: 577,
            width: 278,
            height: 103,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            textAlign: 'center',
            overflow: 'hidden',
            padding: '8px 10px',
            boxSizing: 'border-box',
          }}
        >
          {items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              style={{
                color: GREEN,
                fontFamily: '"Space Mono", monospace',
                fontSize: items.length >= 5 ? 10.5 : items.length >= 4 ? 11.5 : 12.5,
                fontWeight: 700,
                lineHeight: 1.28,
                whiteSpace: 'nowrap',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* BUILDER TITLE
            Hide the template's temporary helper sentence before
            rendering the real builder title. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 364,
            top: 598,
            width: 272,
            height: 48,
            background: '#F1F2E5',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 358,
            top: 577,
            width: 285,
            height: 58,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 12px',
            boxSizing: 'border-box',
            overflow: 'hidden',
            zIndex: 1,
          }}
        >
          <div
            style={{
              color: GREEN,
              fontFamily: '"Arial Narrow", "Bebas Neue", Impact, sans-serif',
              fontSize: fitTextSize(title, 18, 20, 14),
              fontWeight: 900,
              lineHeight: 1.05,
              textTransform: 'uppercase',
              maxWidth: '100%',
              overflowWrap: 'anywhere',
            }}
          >
            {title}
          </div>
        </div>

        {/* BUILDER SUBTEXT
            The master also contains sample helper text inside the pill.
            Cover only the text portion; keep the left icon and border. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 405,
            top: 650,
            width: 225,
            height: 34,
            background: '#F1F2E5',
            borderRadius: 18,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 405,
            top: 650,
            width: 275,
            height: 35,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 40px 0 36px',
            boxSizing: 'border-box',
            overflow: 'hidden',
            color: GREEN,
            fontFamily: '"Space Mono", monospace',
            fontSize: 8.2,
            fontWeight: 700,
            lineHeight: 1.25,
            zIndex: 1,
          }}
        >
          {subtext}
        </div>

        {/* =======================================================
            QR
            The master contains only the empty QR frame here.
            Generated QR is placed inside the frame.
           ======================================================= */}
        <div
          style={{
            position: 'absolute',
            left: 31,
            top: 706,
            width: 151,
            height: 92,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
          }}
        >
          <QRCode
            value={data.qrLink || ' '}
            size={82}
            fgColor={GREEN}
            bgColor="transparent"
            level="M"
          />
        </div>

        {/* BARCODE */}
        <div
          style={{
            position: 'absolute',
            left: 231,
            top: 707,
            width: 303,
            height: 91,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <Barcode
            value={(data.barcodeText || 'HHGOA2026').toUpperCase()}
            width={1.5}
            height={63}
            displayValue={false}
            background="transparent"
            lineColor={GREEN}
            margin={0}
          />
        </div>
      </div>
    </div>
  );
}