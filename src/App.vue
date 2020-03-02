<template>
  <div id="app">
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
      <div class="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
        <router-link to="/" class="navbar-brand">
          <h2 id="logo">&lt;/Pad&gt;</h2>
        </router-link>
        <!-- Modal trigger -->
        <span id="version" data-toggle="modal" data-target="#patch-notes-modal">
          v{{ padVersion }}. <i>What's new?</i>
        </span>

        <!-- Modal -->
        <div
          class="modal fade"
          id="patch-notes-modal"
          tabindex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div
            class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
            role="document"
          >
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title" id="exampleModalCenterTitle">
                  Pad v{{ padVersion }} - Patch notes
                </h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <ul>
                  <li>
                    La <span class="special">barre de recherche/textbox</span> en haut de la page
                    fonctionnera désormais dans toutes les situations !<br />
                    Plus de bugs et plus besoin de passer systématiquement par l'url ou par la page
                    d'accueil !
                  </li>
                  <li>
                    Le <span class="special">nombre de pads</span> est désormais affiché
                    <span class="special">en temps réel</span> et n'est plus juste "18" :D
                  </li>
                  <li>
                    Affichage du <span class="special">numéro de version</span> en haut à gauche et
                    des patch notes.
                  </li>
                  <li>
                    Tous les pads sont désormais synchronisés avec une
                    <span class="special">base de données</span>, ainsi votre mot de passe stocké à
                    l'arrache dans un pad ne sera plus perdu au prochain redémarrage serveur.
                    Pratique !
                  </li>
                  <li>
                    Côté serveur, la <span class="special">mémoire</span> est désormais
                    <span class="special">gérée intelligemment</span> et dynamiquement, fini donc le
                    stockage à l'arrache dans la RAM.
                  </li>
                  <li>
                    Il est désormais possible de définir un
                    <span class="special">mot de passe</span> sur un pad lors de la création de
                    celui-ci (premier accès). Une fois défini, il n'est plus possible de le modifier
                    (pour le moment :D) !
                  </li>
                  <li>
                    Il est désormais possible de
                    <span class="special">
                      modifier le language utilisé pour la coloration syntaxique
                    </span>
                    du code dans les options de chaque pad. Ce paramètre est synchronisé en temps
                    réel avec les autres collaborateurs.
                  </li>
                  <li>
                    Il est désormais possible de voir la
                    <span class="special">liste des pads</span> qui ont été
                    <span class="special">créés</span> en cliquant sur "X pad créés" en haut à
                    droite.
                  </li>
                  <li>
                    L'icône (favicon) moche par défaut du site web a été changé.
                  </li>
                  <li>
                    Côté client, Bootstrap a été mis à jour vers la dernière version (4.4.1).
                  </li>
                </ul>
                Un feedback ? Une idée ?
                <a href="mailto:hugo.cartigny@gmail.com">Contacte-moi !</a>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-accent" data-dismiss="modal">
                  OMG j'adore !
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form id="pad-form" class="mx-auto order-0 inline-collapsed">
        <div class="input-group">
          <input class="form-control" id="pad-slug" type="search" placeholder="Accéder au pad..." />
          <div class="input-group-append">
            <button class="btn btn-accent my-2 my-sm-0" type="submit">
              Go !
            </button>
          </div>
        </div>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target=".dual-collapse2"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </form>

      <div class="navbar-collapse collapse w-100 order-3 dual-collapse2">
        <pad-settings />
        <router-link to="/list" class="router-link-patch navbar-nav ml-auto">
          <h3 class="">{{ padCount }} pads créés.</h3>
        </router-link>
      </div>
    </nav>
    <router-view />
    <footer>
      <p>
        Made with
        <img src="https://twemoji.maxcdn.com/svg/2764.svg" alt="heart" /> by
        <a href="https://github.com/BlueskyFR" target="_blank">
          Hugo Cartigny (@BlueskyFR)
        </a>
      </p>
    </footer>
  </div>
</template>

<script src="./app.js"></script>

<style src="./app.scss" lang="scss"></style>
