const TIERS = [
  {
    id: "buy1",
    label: "Buy 1",
    unitsPaid: 1,
    unitsReceived: 1,
    popular: false,
  },
  {
    id: "buy2",
    label: "Buy 2 Get 1 Free",
    unitsPaid: 2,
    unitsReceived: 3,
    popular: true,
  },
  {
    id: "buy3",
    label: "Buy 3 Get 2 Free",
    unitsPaid: 3,
    unitsReceived: 5,
    popular: false,
  },
];

const UNIT_PRICE = {
  subscribe: 59.99,
  onetime: 69.0,
};

const GIFTS = [
  {
    id: "pillcase",
    name: "On-the-Go Pill Case",
    value: 14.99,
    img: "https://resilia.shop/cdn/shop/files/case_b9fcac89-db7d-432e-929d-adc786e209bd.png?v=1781280413&width=288",
    unlocksAt: ["buy1", "buy2", "buy3"],
  },
  {
    id: "tracker",
    name: "Cortisol Tracker Journal",
    value: 24.99,
    img: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=200&h=200&fit=crop&auto=format",
    unlocksAt: ["buy2", "buy3"],
  },
  {
    id: "shipping",
    name: "Free Shipping",
    value: 4.95,
    img: "https://resilia.shop/cdn/shop/files/8161_1.png?v=1781284423&width=288",
    unlocksAt: ["buy3"],
  },
];

function money(n) {
  return `$${n.toFixed(2)}`;
}

document.addEventListener("alpine:init", () => {
  Alpine.data("offerSelector", () => ({
    mode: "subscribe",
    selected: "buy2",
    tiers: TIERS,
    gifts: GIFTS,

    unitPrice() {
      return UNIT_PRICE[this.mode];
    },

    subscribeSavingsPercent() {
      const onetime = UNIT_PRICE.onetime;
      const subscribe = UNIT_PRICE.subscribe;
      return Math.round(((onetime - subscribe) / onetime) * 100);
    },

    price(tier) {
      return tier.unitsPaid * this.unitPrice();
    },

    compareAt(tier) {
      return tier.unitsReceived * this.unitPrice();
    },

    savings(tier) {
      return this.compareAt(tier) - this.price(tier);
    },

    priceLabel(tier) {
      return money(this.price(tier));
    },

    compareAtLabel(tier) {
      return this.savings(tier) > 0 ? money(this.compareAt(tier)) : null;
    },

    savingsLabel(tier) {
      return this.savings(tier) > 0
        ? `You save ${money(this.savings(tier))}`
        : null;
    },

    get currentTier() {
      return this.tiers.find((t) => t.id === this.selected);
    },

    isGiftUnlocked(gift) {
      return gift.unlocksAt.includes(this.selected);
    },

    giftValueLabel(gift) {
      return money(gift.value);
    },

    addToCart() {
      console.log("Add to cart", {
        mode: this.mode,
        tier: this.selected,
        price: this.price(this.currentTier),
        gifts: this.gifts
          .filter((g) => this.isGiftUnlocked(g))
          .map((g) => g.id),
      });
    },
  }));
});
