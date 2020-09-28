<template>
  <div id="password-view" class="d-flex justify-content-center flex-column">
    <h3 class="mb-2">L'auteur de ce pad a défini un mot de passe</h3>
    <h4 class="mb-5">Vous devez le saisir pour poursuivre.</h4>
    <form @submit.prevent="onSubmit" id="password-form" class="d-flex justify-content-center">
      <div class="form-group text-left">
        <label for="password"><strong>Mot de passe :</strong></label>

        <div :class="{ 'is-invalid': showWarning }" class="input-group">
          <input
            ref="input"
            @keypress="showWarning = false"
            type="password"
            id="password"
            class="form-control"
            placeholder="This is a secret!"
          />
          <div class="input-group-append">
            <button class="btn btn-accent my-2 my-sm-0" type="submit">Valider</button>
          </div>
        </div>
        <div class="invalid-feedback">Mot de passe incorrect.</div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "Editor",
  props: {
    code: String,
  },
  data: function () {
    return {
      editor: null,
      showWarning: false,
    };
  },
  methods: {
    onSubmit() {
      this.$emit("onPassword", this.$refs.input.value);
      this.$refs.input.value = "";
    },
    warnInvalidPassword() {
      this.$refs.input.value = "";
      this.showWarning = true;
      this.$refs.input.focus();
    },
  },
  watch: {
    code: function (newValue /*, oldValue*/) {
      this.editor.setValue(newValue, -1);
    },
  },
  async mounted() {
    this.$refs.input.focus();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "../scss/variables";

#password-view {
  margin: 0;
  height: 100%;
}

#password {
  border: solid 1px $special;
  background-color: $bg;
  color: white;
}

.btn-accent {
  color: black;
  background-color: $special;
  border-color: $special;
}
</style>
