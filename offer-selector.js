const TIERS = [
  {
    id: "buy1",
    label: "Buy 1",
    unitsPaid: 1,
    unitsReceived: 1,
    popular: false,
    freeShipping: false,
  },
  {
    id: "buy2",
    label: "Buy 2 Get 1 Free",
    unitsPaid: 2,
    unitsReceived: 3,
    popular: true,
    freeShipping: false,
  },
  {
    id: "buy3",
    label: "Buy 3 Get 2 Free",
    unitsPaid: 3,
    unitsReceived: 5,
    popular: false,
    freeShipping: true,
  },
];

const UNIT_PRICE = {
  subscribe: 59.99,
  onetime: 69.0,
};

const GIFTS = [
  {
    id: "tracker",
    name: "Cortisol Tracker Journal",
    value: 24.99,
    img: "https://placehold.co/96x96/F7F3EE/2C1F14?text=Journal",
    unlocksAt: ["buy2", "buy3"],
  },
  {
    id: "pillcase",
    name: "On-the-Go Pill Case",
    value: 14.99,
    img: "https://placehold.co/96x96/F7F3EE/2C1F14?text=Case",
    unlocksAt: ["buy3"],
  },
];

function money(n) {
  return `$${n.toFixed(2)}`;
}

document.addEventListener("alpine:init", () => {
  Alpine.data("offerSelector", () => ({
    mode: "subscribe", // 'subscribe' | 'onetime'
    selected: "buy2", // default matches Resilia's "Most Popular" tier
    tiers: TIERS,
    gifts: GIFTS,

    unitPrice() {
      return UNIT_PRICE[this.mode];
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

    hasAnyGiftUnlocked() {
      return this.gifts.some((g) => this.isGiftUnlocked(g));
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
