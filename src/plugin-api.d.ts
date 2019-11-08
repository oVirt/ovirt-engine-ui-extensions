type BusinessEntity = {
  [key: string]: any;
  id: string;
};

type ItemSelectionHandler = (selectedItems: BusinessEntity[]) => void;

interface EventHandlers {

  /**
   * Called by the infrastructure as part of plugin initialization.
   *
   * This function will be called just once during the lifetime of a plugin, before
   * WebAdmin calls any other event handlers.
   *
   * This function is a good place for one-time UI extensions.
   */
  UiInit(): void;

  /**
   * Called after a user logs into WebAdmin.
   *
   * @param userName The name of currently logged in user in `user@domain` format.
   * @param userId The UUID of currently logged in user.
   */
  UserLogin(userName: string, userId: string): void;

  /**
   * Called after a user logs out of WebAdmin.
   */
  UserLogout(): void;

  /**
   * Called when a `Window` object (i.e. plugin contributed UI rendered in an iframe)
   * sends a message to main WebAdmin `Window` object via HTML5 `postMessage` API.
   *
   * For security reasons, the default value of `allowedMessageOrigins` option is an
   * empty array meaning the plugin rejects all messages regardless of their origin.
   *
   * @param data Message event data.
   * @param sourceWindow `Window` object that sent the message.
   *
   * @example
   *
   * api.options({
   *   allowedMessageOrigins: ['http://one.com', 'https://two.org']
   * });
   *
   */
  MessageReceived(data: any, sourceWindow: Window): void;

  // ----- Main Table Item Selection Handlers

  DataCenterSelectionChange: ItemSelectionHandler;
  ClusterSelectionChange: ItemSelectionHandler;
  HostSelectionChange: ItemSelectionHandler;
  NetworkSelectionChange: ItemSelectionHandler;
  StorageSelectionChange: ItemSelectionHandler;
  DiskSelectionChange: ItemSelectionHandler;
  VirtualMachineSelectionChange: ItemSelectionHandler;
  PoolSelectionChange: ItemSelectionHandler;
  TemplateSelectionChange: ItemSelectionHandler;
  GlusterVolumeSelectionChange: ItemSelectionHandler;
  ProviderSelectionChange: ItemSelectionHandler;
  UserSelectionChange: ItemSelectionHandler;
  QuotaSelectionChange: ItemSelectionHandler;
  EventSelectionChange: ItemSelectionHandler;

  // ----- Detail Table Item Selection Handlers

  DetailItemSelectionChange: ItemSelectionHandler;

}

type ButtonEventHandler = (selectedItems: BusinessEntity[], mainEntity?: BusinessEntity) => void;

interface ActionButtonInterface {

  /**
   * Called when the user clicks the button.
   */
  onClick?: ButtonEventHandler;

  /**
   * Controls whether the button is enabled (clickable).
   */
  isEnabled?: ButtonEventHandler;

  /**
   * Controls whether the button is accessible (visible).
   */
  isAccessible?: ButtonEventHandler;

  /**
   * Returns the button's index within the corresponding action panel.
   *
   * Buttons have their index starting at 0 (left-most button) and incremented by 1
   * for each next button.
   */
  index?: number;

}

enum NotificationType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
}

type AlertOptions = Partial<{
  autoHideMs: number;
}>;

type PlaceOptions = Partial<{
  priority: number;
  defaultPlace: boolean;
  searchPrefix: string;
  icon: string;
}>;

type DialogButton = Partial<{
  label: string;
  onClick: () => void;
}>;

type DialogOptions = Partial<{
  buttons: DialogButton[];
  closeIconVisible: boolean;
  closeOnEscKey: boolean;
}>;

type ApiOptions = Partial<{
  allowedMessageOrigins: string | string[];
}>;

/**
 * oVirt WebAdmin UI plugin API.
 *
 * Each plugin has its own API object, created via the global `pluginApi` function:
 *
 * For details on the plugin architecture and lifecycle, please refer to the
 * [feature page](https://www.ovirt.org/develop/release-management/features/ux/uiplugins43).
 *
 * @example
 *
 * // Using `window.top` to access main WebAdmin window due to plugin code being executed
 * // in an iframe. All static plugin resources should be served via oVirt Engine backend
 * // to ensure both main and plugin frames are on the same origin (Same-Origin Policy).
 * const api = window.top.pluginApi(pluginName);
 *
 * // Optional: get runtime plugin configuration object.
 * const cfg = api.configObject();
 *
 * // Optional: customize options that affect specific features of the plugin API.
 * api.options({
 *   // put API options here
 * });
 *
 * // Register event handlers which facilitate WebAdmin => plugin communication.
 * api.register({
 *   UiInit: function () {
 *     // initialize your plugin here
 *   }
 * });
 *
 * // Notify WebAdmin to proceed with plugin initialization, i.e. expect UiInit event call.
 * api.ready();
 */
interface OvirtPluginApi {

  // ----- Core Functions

  /**
   * Register your plugin with the API, passing an `eventHandlers` object containing
   * functions which facilitate WebAdmin => plugin communication.
   *
   * At the very least, the `eventHandlers` object should contain the `UiInit` event
   * handler.
   *
   * This function _must_ be called before the `ready` function.
   *
   * @param eventHandlers Object containing plugin event handlers.
   */
  register(eventHandlers: EventHandlers): void;

  /**
   * Provide custom options that affect specific features of the plugin API.
   *
   * This function may be called anytime during the lifetime of a plugin.
   *
   * @param apiOptions Custom API options to use for this plugin.
   */
  options(apiOptions: ApiOptions): void;

  /**
   * Tell WebAdmin to proceed with plugin initialization and call the `UiInit` event
   * handler.
   *
   * If the `UiInit` event handler completes successfully, the plugin will start receiving
   * calls to other event handlers. If any event handler throws an error, WebAdmin removes
   * the plugin from service.
   *
   * The `register` function _must_ be called before calling this function.
   */
  ready(): void;

  // ----- Accessor Functions

  /**
   * Returns the name of currently logged in user in `user@domain` format.
   */
  loginUserName(): string;

  /**
   * Returns the UUID of currently logged in user.
   */
  loginUserId(): string;

  /**
   * Returns the locale that has been selected by the user when they logged in.
   *
   * The locale is return in `xx_YY` format, e.g. `en_US` or `ja_JP`.
   */
  currentLocale(): string;

  /**
   * Returns the current application place.
   */
  currentPlace(): string;

  /**
   * Returns the base URL of the Engine.
   *
   * This is useful for accessing Engine resources or services.
   */
  engineBaseUrl(): string;

  /**
   * Returns an SSO token which can be used to authenticate Engine requests.
   */
  ssoToken(): string;

  /**
   * Returns the runtime plugin configuration object containing any custom
   * configuration merged on top of any available default configuration for
   * this plugin.
   */
  configObject(): any;

  // ----- Action Functions

  /**
   * Show an alert notification.
   *
   * @param alertType Alert notification type.
   * @param message Message to be shown in the alert.
   */
  showAlert(alertType: NotificationType, message: string, options?: AlertOptions): void;

  /**
   * Show a toast notification.
   *
   * @param toastType Toast notification type.
   * @param message Message to be shown in the toast.
   */
  showToast(toastType: NotificationType, message: string): void;

  /**
   * Reveals the given standard or plugin-contributed primary application place.
   *
   * @param historyToken The `#historyToken` in WebAdmin URL representing the place.
   */
  revealPlace(historyToken: string): void;

  /**
   * Applies the given search string for the currently active place.
   *
   * @param search Text to apply to the search panel.
   */
  setSearchString(search: string): void;

  // ----- Main Views and Detail Tabs

  /**
   * Adds new primary menu place with content provided from the given URL.
   *
   * Primary menu places cannot have secondary menu items, only primary menu containers can.
   *
   * @param label Primary menu item label.
   * @param historyToken Place token to be represented in WebAdmin URL, i.e. `foo-bar`.
   * @param contentUrl The URL passed to the `iframe` element that renders the content.
   */
  addPrimaryMenuPlace(
    label: string,
    historyToken: string,
    contentUrl: string,
    options?: PlaceOptions,
  ): void;

  /**
   * Adds new primary menu container that allows for secondary menu places.
   *
   * @param label Primary menu item label.
   * @param primaryMenuId Plugin provided identifier to be used with `addSecondaryMenuPlace`.
   */
  addPrimaryMenuContainer(
    label: string,
    primaryMenuId: string,
    options?: PlaceOptions,
  ): void;

  /**
   * Adds new secondary menu place with content provided from the given URL.
   *
   * @param primaryMenuId Primary menu container to add the secondary menu to.
   * @param label Secondary menu item label.
   * @param historyToken Place token to be represented in WebAdmin URL, i.e. `foo-bar`.
   * @param contentUrl The URL passed to the `iframe` element that renders the content.
   */
  addSecondaryMenuPlace(
    primaryMenuId: string,
    label: string,
    historyToken: string,
    contentUrl: string,
    options?: PlaceOptions,
  ): void;

  /**
   * Adds a new detail place with content provided from the given URL.
   *
   * @param entityTypeName Main entity type this place is associated with.
   * @param label The label of the detail tab.
   * @param historyToken Place token to be represented in WebAdmin URL, i.e. `foo-bar`.
   * @param contentUrl The URL passed to the `iframe` element that renders the content.
   */
  addDetailPlace(
    entityTypeName: string,
    label: string,
    historyToken: string,
    contentUrl: string,
    options?: PlaceOptions,
  ): void;

  /**
   * Updates the content URL of the given place.
   *
   * @param historyToken Place token to be represented in WebAdmin URL, i.e. `foo-bar`.
   * @param contentUrl The URL passed to the `iframe` element that renders the content.
   */
  setPlaceContentUrl(historyToken: string, contentUrl: string): void;

  /**
   * Controls the access to the given place.
   *
   * This function works only for places added via plugin API.
   *
   * @param historyToken Place token to be represented in WebAdmin URL, i.e. `foo-bar`.
   * @param accessible If `false`, the corresponding menu item or tab header will be
   * hidden and attempts to access it manually by manipulating the URL will be denied.
   */
  setPlaceAccessible(historyToken: string, accessible: boolean): void;

  /**
   * Adds new button to the action panel and context menu for the given menu place.
   *
   * @param entityTypeName Main entity type this place is associated with.
   * @param label Button label.
   * @param buttonInterface Button implementation.
   */
  addMenuPlaceActionButton(
    entityTypeName: string,
    label: string,
    buttonInterface?: ActionButtonInterface,
  ): void;

  /**
   * Adds new button to the action panel and context menu for the given detail tab.
   *
   * @param mainEntityTypeName Main entity type this place is associated with.
   * @param detailPlaceId Detail place identifier.
   * @param label Button label.
   * @param buttonInterface Button implementation.
   */
  addDetailPlaceActionButton(
    mainEntityTypeName: string,
    detailPlaceId: string,
    label: string,
    buttonInterface?: ActionButtonInterface,
  ): void;

  /**
   * Adds an iframe unload handler for the given place.
   *
   * This handler is called when the user transitions away from the application place
   * denoted by `historyToken`.
   *
   * @param historyToken The `#historyToken` in WebAdmin URL representing the place.
   * @param unloadHandler The iframe unload handler.
   */
  setPlaceUnloadHandler(historyToken: string, unloadHandler: () => void): void;

  // ----- Dialogs

  /**
   * Shows a modal dialog with content loaded from the given URL.
   *
   * @deprecated Prefer dialogs directly rendered by the plugin.
   * @param title Dialog title.
   * @param dialogToken Plugin provided token used to reference the dialog instance.
   * @param contentUrl The URL passed to the `iframe` element that renders the content.
   * @param width Dialog width in CSS format, e.g. `800px`.
   * @param height Dialog height in CSS format, e.g. `600px`.
   */
  showDialog(
    title: string,
    dialogToken: string,
    contentUrl: string,
    width: string,
    height: string,
    options?: DialogOptions,
  ): void;

  /**
   * Updates the content URL of the given dialog.
   *
   * @deprecated Prefer dialogs directly rendered by the plugin.
   * @param dialogToken Plugin provided token used to reference the dialog instance.
   * @param contentUrl The URL passed to the `iframe` element that renders the content.
   */
  setDialogContentUrl(dialogToken: string, contentUrl: string): void;

  /**
   * Close the given dialog.
   *
   * @deprecated Prefer dialogs directly rendered by the plugin.
   * @param dialogToken Plugin provided token used to reference the dialog instance.
   */
  closeDialog(dialogToken: string): void;

}

declare function getPluginApi(): OvirtPluginApi;

export default getPluginApi;
