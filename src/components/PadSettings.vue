<template>
  <div>
    <button
      id="options-button"
      type="button"
      :style="optionsButtonStyle"
      :disabled="!showOptions"
      class="btn btn-outline-light ml-3"
      data-toggle="modal"
      data-target="#settings-modal"
    >
      <span class="d-none d-xl-block">Options du pad...</span>
      <span class="d-block d-xl-none">Options...</span>
    </button>
    <!-- Modal -->
    <div class="modal fade" id="settings-modal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="exampleModalCenterTitle">
              Paramètres du pad <code>/{{ this.$route.params.slug }}</code>
            </h4>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-inline mb-3">
              <label for="language-select" class="mr-2">Langage : </label>
              <select
                v-model="selectedLanguage"
                id="language-select"
                class="custom-select custom-select-sm"
              >
                <option v-for="language in languages" :value="language" :key="language">
                  {{ language }}
                </option>
                <option value="html" default>HTML</option>
                <option value="css" default>CSS</option>
              </select>
            </div>

            <div v-show="showAdminTools" class="form-group text-left">
              <label for="password"
                >Ce pad n'a pas encore de mot de passe défini.<br />
                Vous pouvez en définir un ici :</label
              >

              <form @submit.prevent="onSubmit" class="mx-auto order-0 inline-collapsed">
                <div class="input-group input-group-sm d-inline-flex">
                  <input
                    ref="password"
                    class="form-control"
                    id="password"
                    type="password"
                    placeholder="Mot de passe..."
                  />
                  <div class="input-group-append">
                    <button id="btn-set-password" class="btn btn-accent my-2 my-sm-0" type="submit">
                      Go !
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-success" data-dismiss="modal">Ok</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import availableLanguages from "@/modeList.json";

export default {
  data: function () {
    return {
      languages: availableLanguages,
      selectedLanguage: "javascript",
    };
  },
  computed: {
    // Include state properties from Vuex store
    ...mapState([
      "showOptions", // Now available through this.showOptions
      "showAdminTools",
      "options",
    ]),

    optionsButtonStyle: function () {
      return {
        opacity: this.showOptions ? 1 : 0,
        cursor: this.showOptions ? "pointer" : "default",
      };
    },
  },
  methods: {
    ...mapMutations(["setOption"]),

    onSubmit() {
      let password = this.$refs.password.value;
      if (password.trim()) this.setOption({ password: password });
    },
  },
  watch: {
    selectedLanguage: function (newSelectedLanguage) {
      // Language validity check
      if (availableLanguages.includes(newSelectedLanguage))
        this.setOption({ language: newSelectedLanguage });
    },

    "options.language": function (newLanguage) {
      this.selectedLanguage = newLanguage;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
@import "../scss/variables";

.input-group {
  width: auto; // Bootstrap fix
}

#password {
  border: solid 1px $pink;
  background-color: $bg;
  color: white;
}

.btn-accent {
  height: auto; // Bootstrap fix
  color: white;
  background-color: $pink;
  border-color: $pink;
}
</style>
