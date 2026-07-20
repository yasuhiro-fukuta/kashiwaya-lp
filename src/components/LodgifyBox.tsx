/** Lodgify 予約ボックス。
 *  同一 id="lodgify-book-now-box" を1ページに2個置くと2個目が描画されない
 *  ため、各部屋を別々の iframe(=別ページ)に入れて公式コードをそのまま
 *  実行させる。高さは固定(JSなし)。 */
function buildLodgifyDoc(rentalId: string, language: string): string {
  return `<!doctype html>
<html lang="${language}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
<style>
  html, body { margin: 0; background: transparent; font-family: "Outfit", Arial, sans-serif; }
  body { padding-bottom: 30px; }
  :root {
    --ldg-bnb-background: #ffffff;
    --ldg-bnb-border-radius: 0.42em;
    --ldg-bnb-box-shadow: 0px 24px 54px 0px rgba(0, 0, 0, 0.1);
    --ldg-bnb-padding: 14px;
    --ldg-bnb-input-background: #ffffff;
    --ldg-bnb-button-border-radius: 3.58em;
    --ldg-bnb-color-primary: #fac600;
    --ldg-bnb-color-primary-lighter: #fde380;
    --ldg-bnb-color-primary-darker: #7d6300;
    --ldg-bnb-color-primary-contrast: #333333;
    --ldg-component-calendar-cell-selection-bg-color: #fac600;
    --ldg-component-calendar-cell-selection-color: #333333;
    --ldg-component-calendar-cell-selected-bg-color: #fde380;
    --ldg-component-calendar-cell-selected-color: #333333;
    --ldg-bnb-font-family: inherit;
  }
  #lodgify-book-now-box { width: 100%; }
</style>
</head>
<body>
<div
  id="lodgify-book-now-box"
  data-rental-id="${rentalId}"
  data-website-id="633228"
  data-slug="yasuo"
  data-language-code="${language}"
  data-new-tab="true"
  data-version="stable"
  data-has-guests-breakdown
  data-check-in-label='Check-in'
  data-check-out-label='Check-out'
  data-guests-label='Guests'
  data-guests-singular-label='{{NumberOfGuests}} guest'
  data-guests-plural-label='{{NumberOfGuests}} guests'
  data-location-input-label='Location'
  data-total-price-label='Total price:'
  data-select-dates-to-see-price-label='Select dates to see total price'
  data-minimum-price-per-night-first-label='From'
  data-minimum-price-per-night-second-label='per night'
  data-book-button-label='Book Now'
  data-guests-breakdown-label='Guests'
  data-adults-label='{"one":"adult","other":"adults"}'
  data-adults-description='Ages {minAge} or above'
  data-children-label='{"one":"child","other":"children"}'
  data-children-description='Ages {minAge}-{maxAge}'
  data-children-not-allowed-label='Not suitable for children'
  data-infants-label='{"one":"infant","other":"infants"}'
  data-infants-description='Under {maxAge}'
  data-infants-not-allowed-label='Not suitable for infants'
  data-pets-label='{"one":"pet","other":"pets"}'
  data-pets-not-allowed-label='Not allowed'
  data-done-label='Done'
></div>
<script src="https://app.lodgify.com/book-now-box/stable/renderBookNowBox.js" defer></script>
</body>
</html>`;
}

export default function LodgifyBox({
  rentalId,
  language = "en",
}: {
  rentalId: string;
  language?: string;
}) {
  return (
    <iframe
      title={"Booking " + rentalId}
      srcDoc={buildLodgifyDoc(rentalId, language)}
      scrolling="no"
      style={{
        display: "block",
        width: 320,
        maxWidth: "100%",
        margin: "1rem auto 0",
        height: 430, // 固定。上にボックス、下はカレンダーが開くスペース
        border: "none",
        background: "transparent",
      }}
    />
  );
}
