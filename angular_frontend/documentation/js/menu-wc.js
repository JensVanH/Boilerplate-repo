'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">marketplace documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-4fd119be65b3b413c3cf240c58e7fb5bd49c8209a720063597099a735e82524f03c0273f4c236b7f17fbbf6f77a5a47b0f6880ce3af7d72aadb6edc74bfd44b7"' : 'data-target="#xs-components-links-module-AppModule-4fd119be65b3b413c3cf240c58e7fb5bd49c8209a720063597099a735e82524f03c0273f4c236b7f17fbbf6f77a5a47b0f6880ce3af7d72aadb6edc74bfd44b7"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-4fd119be65b3b413c3cf240c58e7fb5bd49c8209a720063597099a735e82524f03c0273f4c236b7f17fbbf6f77a5a47b0f6880ce3af7d72aadb6edc74bfd44b7"' :
                                            'id="xs-components-links-module-AppModule-4fd119be65b3b413c3cf240c58e7fb5bd49c8209a720063597099a735e82524f03c0273f4c236b7f17fbbf6f77a5a47b0f6880ce3af7d72aadb6edc74bfd44b7"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CategoriesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CategoriesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MessagesComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MessagesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-4fd119be65b3b413c3cf240c58e7fb5bd49c8209a720063597099a735e82524f03c0273f4c236b7f17fbbf6f77a5a47b0f6880ce3af7d72aadb6edc74bfd44b7"' : 'data-target="#xs-injectables-links-module-AppModule-4fd119be65b3b413c3cf240c58e7fb5bd49c8209a720063597099a735e82524f03c0273f4c236b7f17fbbf6f77a5a47b0f6880ce3af7d72aadb6edc74bfd44b7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-4fd119be65b3b413c3cf240c58e7fb5bd49c8209a720063597099a735e82524f03c0273f4c236b7f17fbbf6f77a5a47b0f6880ce3af7d72aadb6edc74bfd44b7"' :
                                        'id="xs-injectables-links-module-AppModule-4fd119be65b3b413c3cf240c58e7fb5bd49c8209a720063597099a735e82524f03c0273f4c236b7f17fbbf6f77a5a47b0f6880ce3af7d72aadb6edc74bfd44b7"' }>
                                        <li class="link">
                                            <a href="injectables/CompanyService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CompanyService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ListingModule.html" data-type="entity-link" >ListingModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ListingModule-acd7fccd8ad6b859123ef4cd6ff9cac9aea2d062ec19d85daa80a1c8ec603b3bcca6ab9570638fba66d8035191c182d3b535d677e53a0b1ef4014fe9be8082ba"' : 'data-target="#xs-components-links-module-ListingModule-acd7fccd8ad6b859123ef4cd6ff9cac9aea2d062ec19d85daa80a1c8ec603b3bcca6ab9570638fba66d8035191c182d3b535d677e53a0b1ef4014fe9be8082ba"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ListingModule-acd7fccd8ad6b859123ef4cd6ff9cac9aea2d062ec19d85daa80a1c8ec603b3bcca6ab9570638fba66d8035191c182d3b535d677e53a0b1ef4014fe9be8082ba"' :
                                            'id="xs-components-links-module-ListingModule-acd7fccd8ad6b859123ef4cd6ff9cac9aea2d062ec19d85daa80a1c8ec603b3bcca6ab9570638fba66d8035191c182d3b535d677e53a0b1ef4014fe9be8082ba"' }>
                                            <li class="link">
                                                <a href="components/CreateEditListingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateEditListingComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListingDetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListingDetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ListingsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MylistingsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MylistingsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TaxonomyModule.html" data-type="entity-link" >TaxonomyModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TaxonomyModule-05bf26f27cff78bb219f3ed62088a5e8525736573715d876cffdc4c520491496421aef6499a332507eadf62b871af68009c0973a3d8e7c3f39a5a7677dcb73c1"' : 'data-target="#xs-components-links-module-TaxonomyModule-05bf26f27cff78bb219f3ed62088a5e8525736573715d876cffdc4c520491496421aef6499a332507eadf62b871af68009c0973a3d8e7c3f39a5a7677dcb73c1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TaxonomyModule-05bf26f27cff78bb219f3ed62088a5e8525736573715d876cffdc4c520491496421aef6499a332507eadf62b871af68009c0973a3d8e7c3f39a5a7677dcb73c1"' :
                                            'id="xs-components-links-module-TaxonomyModule-05bf26f27cff78bb219f3ed62088a5e8525736573715d876cffdc4c520491496421aef6499a332507eadf62b871af68009c0973a3d8e7c3f39a5a7677dcb73c1"' }>
                                            <li class="link">
                                                <a href="components/TaxonomyComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TaxonomyComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-TaxonomyModule-05bf26f27cff78bb219f3ed62088a5e8525736573715d876cffdc4c520491496421aef6499a332507eadf62b871af68009c0973a3d8e7c3f39a5a7677dcb73c1"' : 'data-target="#xs-pipes-links-module-TaxonomyModule-05bf26f27cff78bb219f3ed62088a5e8525736573715d876cffdc4c520491496421aef6499a332507eadf62b871af68009c0973a3d8e7c3f39a5a7677dcb73c1"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-TaxonomyModule-05bf26f27cff78bb219f3ed62088a5e8525736573715d876cffdc4c520491496421aef6499a332507eadf62b871af68009c0973a3d8e7c3f39a5a7677dcb73c1"' :
                                            'id="xs-pipes-links-module-TaxonomyModule-05bf26f27cff78bb219f3ed62088a5e8525736573715d876cffdc4c520491496421aef6499a332507eadf62b871af68009c0973a3d8e7c3f39a5a7677dcb73c1"' }>
                                            <li class="link">
                                                <a href="pipes/OrderByPipe.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrderByPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionModule.html" data-type="entity-link" >TransactionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TransactionModule-cca1beb902fd2db5b72fe5c4efd78022b23ba9507a3e879076ac6377fabc87504292943a73a7f768dce3baa86f4ea3e1f784c55ea91d999c6de4b3e0b720f091"' : 'data-target="#xs-components-links-module-TransactionModule-cca1beb902fd2db5b72fe5c4efd78022b23ba9507a3e879076ac6377fabc87504292943a73a7f768dce3baa86f4ea3e1f784c55ea91d999c6de4b3e0b720f091"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TransactionModule-cca1beb902fd2db5b72fe5c4efd78022b23ba9507a3e879076ac6377fabc87504292943a73a7f768dce3baa86f4ea3e1f784c55ea91d999c6de4b3e0b720f091"' :
                                            'id="xs-components-links-module-TransactionModule-cca1beb902fd2db5b72fe5c4efd78022b23ba9507a3e879076ac6377fabc87504292943a73a7f768dce3baa86f4ea3e1f784c55ea91d999c6de4b3e0b720f091"' }>
                                            <li class="link">
                                                <a href="components/TransactiondetailComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TransactiondetailComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TransactionsComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TransactionsComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UserModule-b3fc8ba2a60c1e3592c45877fd302ed0e467bbeb81f70584566aad61530c96d07e12243c0b76168ed81330c918705b92522250134f7e54ad1f37b5b55f9cd2a4"' : 'data-target="#xs-components-links-module-UserModule-b3fc8ba2a60c1e3592c45877fd302ed0e467bbeb81f70584566aad61530c96d07e12243c0b76168ed81330c918705b92522250134f7e54ad1f37b5b55f9cd2a4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UserModule-b3fc8ba2a60c1e3592c45877fd302ed0e467bbeb81f70584566aad61530c96d07e12243c0b76168ed81330c918705b92522250134f7e54ad1f37b5b55f9cd2a4"' :
                                            'id="xs-components-links-module-UserModule-b3fc8ba2a60c1e3592c45877fd302ed0e467bbeb81f70584566aad61530c96d07e12243c0b76168ed81330c918705b92522250134f7e54ad1f37b5b55f9cd2a4"' }>
                                            <li class="link">
                                                <a href="components/ChangePasswordComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ChangePasswordComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SignupComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SignupComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-b3fc8ba2a60c1e3592c45877fd302ed0e467bbeb81f70584566aad61530c96d07e12243c0b76168ed81330c918705b92522250134f7e54ad1f37b5b55f9cd2a4"' : 'data-target="#xs-injectables-links-module-UserModule-b3fc8ba2a60c1e3592c45877fd302ed0e467bbeb81f70584566aad61530c96d07e12243c0b76168ed81330c918705b92522250134f7e54ad1f37b5b55f9cd2a4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-b3fc8ba2a60c1e3592c45877fd302ed0e467bbeb81f70584566aad61530c96d07e12243c0b76168ed81330c918705b92522250134f7e54ad1f37b5b55f9cd2a4"' :
                                        'id="xs-injectables-links-module-UserModule-b3fc8ba2a60c1e3592c45877fd302ed0e467bbeb81f70584566aad61530c96d07e12243c0b76168ed81330c918705b92522250134f7e54ad1f37b5b55f9cd2a4"' }>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/NotFoundComponent.html" data-type="entity-link" >NotFoundComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link" >AppPage</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/DbConnectionService.html" data-type="entity-link" >DbConnectionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ImageService.html" data-type="entity-link" >ImageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PropertiesService.html" data-type="entity-link" >PropertiesService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Message.html" data-type="entity-link" >Message</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Properties.html" data-type="entity-link" >Properties</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});