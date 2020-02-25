<template>
  <div id="app" style="text-align: center; margin-top: 64px;">
    <div>
      <button
        class="ui button"
        v-for="(preset, index) in prettyPresets"
        :key="preset"
        v-bind:class="{ primary: amount === preset }"
        v-on:click="
          presetIndex = index
          amount = preset
        "
      >
        {{ currency.symbol }} {{ preset.toLocaleString("en-US") }}
      </button>
    </div>
    <div class="ui hidden divider"></div>
    <div class="ui right action input">
      <input
        type="number"
        v-model.number="amount"
        v-on:keydown="handleKeydownAmount"
        v-on:input="handleInputAmount"
      />
      <select v-bind:value="currency.code" v-on:change="handleChangeCurrency">
        <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
          {{ currency.name }}
        </option>
      </select>
    </div>
    <div class="ui hidden divider"></div>
    <button class="large primary ui button" v-on:click="handleClickDonate()">Donate</button>
  </div>
</template>

<script>
export default {
  name: "DonationForm",
  data: function() {
    const currencies = [
      { name: "US Dollar", code: "USD", symbol: "$", rate: 1 },
      { name: "Euro", code: "EUR", symbol: "€", rate: 0.897597 },
      { name: "British Pound", code: "GBP", symbol: "£", rate: 0.81755 },
      { name: "Russian Ruble", code: "RUB", symbol: "₽", rate: 63.461993 }
    ]
    const currency = currencies[0]
    const presets = [40, 100, 200, 1000, 2500, 5000]
    const presetIndex = 0
    const amount = presets[presetIndex]
    return {
      presets,
      amount,
      currency,
      currencies,
      presetIndex
    }
  },
  computed: {
    prettyPresets: function() {
      if (this.currency.rate === 1) return this.presets
      return this.presets.map(p => this.prettifyValue(p * this.currency.rate))
    }
  },
  methods: {
    prettifyValue: function(value) {
      const div = value < 100 ? 10 : value < 1000 ? 100 : value < 10000 ? 1000 : 10000
      return Math.round(value / div) * div
    },
    handleChangeCurrency: function(e) {
      const value = e.target.value
      const prevCurrency = this.currency
      this.currency = this.currencies.find(c => c.code === value)
      this.amount =
        this.presetIndex !== null
          ? this.prettyPresets[this.presetIndex]
          : parseInt((this.amount / prevCurrency.rate) * this.currency.rate)
    },
    handleInputAmount: function(e) {
      const matchingPreset = this.prettyPresets.find(p => p === +e.target.value)
      this.presetIndex = !matchingPreset ? null : this.prettyPresets.indexOf(matchingPreset)
    },
    handleKeydownAmount: function(e) {
      if (["e", "."].includes(e.key)) e.preventDefault()
    },
    handleClickDonate: function() {
      const {
        amount,
        currency: { code: currency }
      } = this
      fetch("http://localhost:3000/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency })
      }).then(res => {
        if (res.ok) alert("Thank you for your donation!")
      })
    }
  }
}
</script>
