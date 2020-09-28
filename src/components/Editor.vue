<template>
  <div id="editor"></div>
</template>

<!--
<div class="custom-control custom-switch">
  <input type="checkbox" class="custom-control-input" id="customSwitch1">
  <label class="custom-control-label" for="customSwitch1">Toggle this switch element</label>
</div>
<div class="custom-control custom-switch">
  <input type="checkbox" class="custom-control-input" disabled id="customSwitch2">
  <label class="custom-control-label" for="customSwitch2">Disabled switch element</label>
</div>
-->

<script>
import { mapMutations } from "vuex";
import Ace from "ace-builds/src-min-noconflict/ace";
import "ace-builds/src-min-noconflict/theme-monokai";
import "ace-builds/src-min-noconflict/mode-javascript";

export default {
  name: "Editor",
  props: {
    code: String,
    lastDelta: Object,
    language: String,
  },
  data: function () {
    return {
      editor: null,
      ignoreDelta: false,
    };
  },
  methods: {
    // Include mutations from Vuex store
    ...mapMutations([
      "showOptions", // Now available through this.showOptions(bool)
    ]),
  },
  watch: {
    code: function (newValue /*, oldValue*/) {
      // The following works because Ace processes events synchronously.
      // This is the only way to do it as Ace does not have a "silent" option for setValue.
      this.ignoreDelta = true;
      this.editor.setValue(newValue, -1);
      this.ignoreDelta = false;

      this.editor.focus();
    },
    lastDelta: function (newDelta) {
      if (newDelta) {
        this.editor.getSession().getDocument().applyDelta(newDelta);
      }
    },
    language: function (newLanguage) {
      this.editor.session.setMode(`ace/mode/${newLanguage}`);
    },
  },
  mounted() {
    const CDN = "https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-min-noconflict";
    Ace.config.set("basePath", CDN);
    Ace.config.set("modePath", CDN);
    Ace.config.set("themePath", CDN);
    Ace.config.set("workerPath", CDN);

    this.editor = Ace.edit("editor");

    this.editor.setTheme("ace/theme/monokai");
    this.editor.session.setMode(`ace/mode/${this.language}`);
    this.editor.setPrintMarginColumn(9999);
    window.editor = this.editor;

    this.editor.setValue(this.code, -1);

    this.editor.on("change", (delta) => {
      if (!this.ignoreDelta) this.$emit("onInput", delta, this.editor.getValue());
    });

    this.$emit("onEditorReady");
    this.editor.focus();
    this.showOptions(true);
  },
  beforeDestroy() {
    this.showOptions(false);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
$toolbarHeight: 30px;

.editor-wrapper {
  height: 100%;
}

#toolbar {
  height: auto;
  padding: 0 5px 5px 5px;

  display: flex;
  flex-direction: row;
  align-items: center;

  select {
    text-align: center;
    text-align-last: center;
    -ms-text-align-last: center;
    -moz-text-align-last: center;

    color: white;
    background: transparent
      url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='white' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e")
      no-repeat right 0.75rem center/8px 10px;

    option {
      background-color: #343a40;
      border: none;
    }
  }
}

#editor {
  margin: 0;
  height: calc(100% - #{$toolbarHeight});
}
</style>
