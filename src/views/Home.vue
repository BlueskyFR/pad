<template>
  <div class="home d-flex align-items-center">
    <div class="container">
      <h1>Bienvenue sur le <span id="logo">&lt;/Pad&gt;</span> !</h1>
      <p class="mb-5">
        Pour commencer, accédez à un pad en utilisant la
        <u v-on:click="focusTextbox">textbox ci-dessus</u>.
      </p>

      <h4>Partage rapide. Pratique. En temps réel.</h4>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HomePage from "@/components/HomePage.vue";

export default {
  name: "home",
  components: {
    //HomePage
  },
  methods: {
    focusTextbox: function() {
      let tb = $("#pad-slug");
      tb.focus();

      const words = [
        "aubergine",
        "presse-papier",
        "gravier",
        "enceintes",
        "parfum",
        "pamplemousse",
        "poutre",
        "podcast",
        "panda",
        "ninja",
        "cookie",
        "banane",
        "42",
        "ping",
        "pong",
        "baleineaquatique17",
        "no-inspiration",
        "avionetoile568",
        "foodhouse356"
      ];
      const word = words[Math.floor(Math.random() * words.length)];
      const delay = 100; // in ms

      for (let i = 0; i < word.length; i++) {
        setTimeout(() => {
          tb.val(word.slice(0, i + 1));
        }, i * delay);
      }
      setTimeout(() => tb.select(), word.length * delay);
    }
  }
};
</script>

<style lang="scss">
@import "../scss/variables";

.home {
  width: 100%;
  height: 100%;

  h1 {
    margin: 0;
    padding: 0;
    color: white;
  }

  p {
    font-style: italic;
    color: $accent;
  }

  u {
    cursor: pointer;
  }
}
</style>
