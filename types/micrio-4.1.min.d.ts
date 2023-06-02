declare module "Micrio" {
  import type { Readable, Writable } from "svelte/store";
  /**
   * Micrio user input event handler
   * @author Marcel Duin <marcel@micr.io>
   * @copyright Q42 Internet BV, Micrio, 2015 - 2023
   * @link https://micr.io/ , https://q42.nl/en/
   */
  export class Events {
    /** User is currently manually navigating or not
     * @returns Whether the user is using mouse/gestures to navigate right now
     */
    get isNavigating(): boolean;
    /** Hook all event listener */
    hook(): void;
    /** Unhook all event listener */
    unhook(): void;
    /** Hook keyboard event listeners */
    hookKeys(): void;
    /** Unhook keyboard event listeners */
    unhookKeys(): void;
    /** Hook mousewheel / scroll event listeners */
    hookScroll(): void;
    /** Unhook mousewheel / scroll event listeners */
    unhookScroll(): void;
    /** Hook touch/pinch event listeners */
    hookPinch(): void;
    /** Unhook touch/pinch event listeners */
    unhookPinch(): void;
    /** Hook mouse/touch dragging event listeners */
    hookDrag(): void;
    /** Unhook mouse/touch dragging event listeners */
    unhookDrag(): void;
  }
  /**
   * # Micrio State management
   *
   * Newly introduced in Micrio 4.0 is the replacement of the way you can interact with markers and tours from a classic imperative JavaScript API to a Svelte-inspired, store-based **state** management using [[`SvelteStore`]].
   *
   * This has greatly simplified the internal workings and has made the HTML interface fully reactive based on the image state instead of being interwoven in the previous JS API itself.
   *
   * There are 2 `State` controllers:
   *
   * 1. [[`State.Main`]]: the main [[`HTMLMicrioElement.state`]] state controller, used for:
   * 	* Getting and setting the active tour and marker
   * 	* Loading and saving the entire current state as a minimal independent JSON object
   * 2. [[`State.Image`]]: individual image [[`MicrioImage.state`]] controller, used for:
   * 	* Setting the current opened marker in this image
   * 	* Getting the image's last known viewport, even if it is not active at the moment
   *
   * ## Upgrading from Micrio 3.x to 4.x
   *
   * Please refer to [this Micrio knowledge base article](https://kb.micr.io/for-developers/upgrading-micrio-3-to-4)
   * for if you want to upgrade an existing 3.x implementation to 4.x.
   *
   * @author Marcel Duin <marcel@micr.io>
   * @copyright Q42 Internet BV, Micrio, 2015 - 2023
   * @link https://micr.io/ , https://q42.nl/en/
   */
  export namespace State {
    /** A main Micrio state JSON object */
    type MicrioStateJSON = {
      /** The current image id */
      id: string;
      /** Array of individual image states */
      c: Array<number | string>[];
      /** Any running tour */
      t?: [string, number?];
      /** Any running media */
      m?: HTMLMediaElement;
    };
    /**
     * # HTMLMicrioElement state controller
     *
     * The [[`State.Main`]] constructor is used as [[`HTMLMicrioElement.state`]], and offers:
     *
     * * Reading and setting the active tour and marker
     * * Loading and saving the entire current state as a minimal independent JSON object
     *
     */
    class Main {
      private micrio;
      /** The current [[`MarkerTour`]] or [[`VideoTour`]] store [[`Writable`]] */
      readonly tour: Writable<
        | Models.ImageCultureData.VideoTour
        | Models.ImageCultureData.MarkerTour
        | undefined
      >;
      /** The current active [[`MarkerTour`]] or [[`VideoTour`]] */
      get $tour():
        | Models.ImageCultureData.VideoTour
        | Models.ImageCultureData.MarkerTour;
      /** The current shown image's opened [[`Marker`]] store [[`Writable`]] */
      readonly marker: Writable<Models.ImageCultureData.Marker | undefined>;
      /** The current opened [[`Marker`]] of the current shown [[`MicrioImage`]] */
      get $marker(): Models.ImageCultureData.Marker;
      /** Currently playing media controller */
      media: {
        /** Play the media */
        play: () => Promise<void>;
        /** Pause the media */
        pause: () => void;
        /** Media paused state */
        paused: boolean;
        /** Media current time */
        currentTime: number;
        /** Media total duration */
        duration: number;
      };
      /**
       * Gets the current state as an independent, minimal JSON object.
       * This includes the currently open image(s), marker(s), and actively playing media (video, audio, tour) and its state.
       * You can use this object in any other environment to immediately replicate this state (neat!).
       *
       * Example:
       *
       * ```js
       * // Save the current state in Browser 1
       * const state = micrio.state.get();
       *
       * // Save or sync this object to Browser 2 and load it there..
       *
       * // This makes the <micr-io> session state identical to Browser 1.
       * micrio.state.set(state);
       */
      get(): MicrioStateJSON;
      /**
       * Sets the state from a `MicrioStateJSON` object, output by the function above here.
       * This works on any Micrio instance!
       */
      set(s: MicrioStateJSON): void;
      private setTour;
    }
    /**
     * # MicrioImage state controller
     *
     * The [[`State.Image`]] constructor is used as [[`MicrioImage.state`]], and offers:
     *
     * * Setting the current opened marker in this image
     * * Getting the image's last known viewport, even if it is not active at the moment
     */
    class Image {
      private image;
      /** The current image viewport store [[`Writable`]] */
      readonly view: Writable<View>;
      /** The current or last known viewport of this image */
      get $view(): View;
      /**
       * The current active marker store [[`Writable`]].
       * You can either set this to be a [[`Marker`]] JSON object, or `string`, which is the ID
       * of the marker you wish to open.
       */
      readonly marker: Writable<
        Models.ImageCultureData.Marker | string | undefined
      >;
      /** The current active Marker instance */
      get $marker(): Models.ImageCultureData.Marker;
    }
  }
  /**
   * [[include:./ts/element.md]]
   * @author Marcel Duin <marcel@micr.io>
   * @copyright Q42 Internet BV, Micrio, 2015 - 2023
   * @link https://micr.io/ , https://q42.nl/en/
   */
  export class HTMLMicrioElement extends HTMLElement {
    static get observedAttributes(): string[];
    /** Current main [[`MicrioImage`]] store [[`Writable`]]. Its value can be referred to using the [[`$current`]] property */
    readonly current: Writable<MicrioImage | undefined>;
    /** The current active and shown MicrioImage, returning the current value of the [[`current`]] store [[`Writable`]]
     * @readonly
     */
    get $current(): MicrioImage;
    /** In split screen mode, this is the secondary image
     * @readonly
     */
    readonly secondary: Writable<MicrioImage | undefined>;
    /** The virtual camera instance to control the current main image views */
    readonly camera: Camera;
    /** User input browser event handlers */
    readonly events: Events;
    /** The main state manager. Read more about it in the [[`State`]] section.*/
    readonly state: State.Main;
    /** Google analytics plugin */
    private readonly analytics;
    /** Router */
    private readonly router;
    /** Custom settings, if specified, this overwrites any server received data */
    defaultSettings?: Partial<Models.ImageInfo.Settings>;
    /** Open a Micrio image by ID or [[`Models.ImageInfo.ImageInfo`]] JSON data
     * @param idOrInfo An image ID or a [[Models.ImageInfo.ImageInfo]] JSON object
     * @param asSplitscreen Open this image as a secondary split screen image
     */
    open(
      idOrInfo: string | Partial<Models.ImageInfo.ImageInfo>,
      asSplitscreen?: boolean
    ): MicrioImage;
    /** Close an opened MicrioImage
     * @param img The currently visible [[MicrioImage]]
     */
    close(img: MicrioImage): void;
    private loadGallery;
  }
  /** A viewport rectangle */
  export type View = number[] | Float64Array;
  /**
   * The virtual Micrio camera
   * @author Marcel Duin <marcel@micr.io>
   * @copyright Q42 Internet BV, Micrio, 2015 - 2023
   * @link https://micr.io/ , https://q42.nl/en/
   */
  export class Camera {
    /** Currently in split screen mode */
    private isSplitScreen;
    /** Get the current image view rectangle
     * @returns The current screen viewport
     */
    getView: () => Float64Array | null;
    /** Set the screen viewport
     * @param view The viewport
     * @param noLimit Don't restrict the boundaries
     */
    setView(view: View, noLimit?: boolean): void;
    /** Gets the static image XY coordinates of a screen coordinate
     * @param x The screen X coordinate in pixels
     * @param y The screen Y coordinate in pixels
     * @param absolute Use absolute browser window coordinates
     * @param noLimit Allow to go out of image bounds
     * @returns The relative image XY coordinates
     */
    getCoo: (
      x: number,
      y: number,
      absolute?: boolean,
      noLimit?: boolean
    ) => Float64Array;
    /** Sets current coordinates as the center of the screen
     * @param x The X Coordinate
     * @param y The Y Coordinate
     * @param scale The scale to set
     */
    setCoo(x: number, y: number, scale?: number): void;
    /** Get the current image coordinates at the center of the screen */
    getCurrentCoo: () => Float64Array;
    /** Gets the static screen XY coordinates of an image coordinate
     * @param x The image X coordinate
     * @param y The image Y coordinate
     * @param abs Use absolute browser window coordinates
     * @returns The screen XY coordinates in pixels
     */
    getXY: (x: number, y: number, abs?: boolean) => Float64Array;
    /** Get the current image scale */
    getScale: () => number;
    /** Get the scale when the image would cover the screen*/
    getCoverScale: () => number;
    /** Get the minimum scale
     * @returns The minimum scale
     */
    getMinScale: () => number;
    /** Sets the minimum scale
     * @param s The minimum scale to set
     */
    setMinScale(s: number): void;
    /** Returns true when the camera is zoomed in to the max */
    isZoomedIn: () => boolean;
    /** Returns true when the camera is fully zoomed out */
    isZoomedOut: () => boolean;
    /** Limit camera navigation boundaries
     * @param limit The viewport limit
     */
    setLimit(limit: View): void;
    /** Limit camera navigation boundaries
     * @param x The viewport width to limit to
     * @param y The viewport height to limit to
     */
    set360RangeLimit(x?: number, y?: number): void;
    /** Fly to a specific view
     * @returns Promise when the animation is done
     * @param view The viewport to fly to
     * @param duration A forced duration in ms of the animation
     * @param speed A non-default camera speed
     * @param progress Set the starting animation progress percentage
     * @param prevView Base the progress override on this starting view
     * @param isJump Zoom out and in during the animation
     */
    flyToView: (
      view: View,
      duration?: number,
      speed?: number,
      progress?: number,
      prevView?: View,
      isJump?: boolean
    ) => Promise<void>;
    /** Fly to a full view of the image
     * @param duration A forced duration in ms of the animation
     * @param speed A non-default camera speed
     * @returns Promise when the animation is done
     */
    flyToFullView: (duration?: number, speed?: number) => Promise<void>;
    /** Fly to a screen-covering view of the image
     * @param duration A forced duration in ms of the animation
     * @param speed A non-default camera speed
     * @returns Promise when the animation is done
     */
    flyToCoverView: (duration?: number, speed?: number) => Promise<void>;
    /** Fly to the specific coordinates
     * @param coords The X, Y and scale coordinates to fly to
     * @param duration A forced duration in ms of the animation
     * @param speed A non-default camera speed
     * @returns Promise when the animation is done
     */
    flyToCoo: (
      coords: number[],
      duration?: number,
      speed?: number
    ) => Promise<void>;
    /** Do a "jump" animation to the specific view
     * @returns Promise when the animation is done
     * @param view The viewport to fly to
     * @param duration A forced duration in ms of the animation
     * @param speed A non-default camera speed
     */
    jumpToView(view: View, duration?: number, speed?: number): Promise<void>;
    /** Do a zooming animation
     * @param delta The amount to zoom
     * @param duration A forced duration in ms of the animation
     * @param x Screen pixel X-coordinate as zoom focus
     * @param y Screen pixel Y-coordinate as zoom focus
     * @param speed A non-default camera speed
     * @param noLimit Can zoom outside of the image boundaries
     * @returns Promise when the zoom animation is done
     */
    zoom: (
      delta: number,
      duration?: number,
      x?: number,
      y?: number,
      speed?: number,
      noLimit?: boolean
    ) => Promise<void>;
    /** Zoom out a factor
     * @param factor The amount to zoom in
     * @param duration A forced duration in ms of the animation
     * @param speed A non-default camera speed
     * @returns Promise when the zoom animation is done
     */
    zoomIn: (
      factor?: number,
      duration?: number,
      speed?: number
    ) => Promise<void>;
    /** Zoom out a factor
     * @param factor The amount to zoom out
     * @param duration A forced duration in ms of the animation
     * @param speed A non-default camera speed
     * @returns Promise when the zoom animation is done
     */
    zoomOut: (
      factor?: number,
      duration?: number,
      speed?: number
    ) => Promise<void>;
    /** Pan relative pixels
     * @param x The horizontal number of pixels to pan
     * @param y The vertical number of pixels to pan
     * @param duration An optional duration
     */
    pan(x: number, y: number, duration?: number): void;
    /** Stop any animation */
    stop(): void;
    /** Get the current direction facing in 360 mode in radians */
    getDirection: () => number;
    /** Sets the 360 viewing direction in radians
     * @param yaw The direction in radians
     * @param pitch Optional pitch in radians
     */
    setDirection(yaw: number, pitch?: number): void;
    /** Get the current direction pitch
     * @returns The current pitch in radians
     */
    getPitch: () => number;
    /** Set virtual offset margins applied to all viewports
     * @param width The offset width in pixels
     * @param height The offset height in pixels
     */
    setMargins(width: number, height: number): void;
  }
  /**
   * An individual Micrio image
   * @author Marcel Duin <marcel@micr.io>
   * @copyright Q42 Internet BV, Micrio, 2015 - 2023
   * @link https://micr.io/ , https://q42.nl/en/
   */
  export class MicrioImage {
    /** The image id */
    readonly id: string;
    /** The Micrio info data Readable store */
    readonly info: Readable<Models.ImageInfo.ImageInfo>;
    /** The image info data
     * @readonly
     */
    get $info(): Models.ImageInfo.ImageInfo;
    /** The Micrio culture data Writable */
    readonly data: Writable<
      Models.ImageCultureData.ImageCultureData | undefined
    >;
    /** The current CultureData */
    get $data(): Models.ImageCultureData.ImageCultureData;
    /** The current data language Writable */
    readonly lang: Writable<string>;
    /** The current CultureData */
    get $lang(): string;
    /** State manager */
    readonly state: State.Image;
    private loadScript;
    private loadStyle;
    /** Enrich marker tour data with external tour step info and durations
     * This method is called BEFORE Image.data is set. So that's pretty neat.
     */
    private enrichData;
    private parseIIIFSequence;
  }
  /**
   * Video tour controller
   * @author Marcel Duin <marcel@micr.io>
   * @copyright Q42 Internet BV, Micrio, 2015 - 2023
   * @link https://micr.io/ , https://q42.nl/en/
   */
  /** The Video Tour class */
  export class VideoTour {
    private micrio;
    private data;
    /** The tour timeline */
    private timeline;
    /** Current timeline segment index */
    private currentIndex;
    /** (Re)start the tour at this point */
    private startAt;
    /** Internal timeout handle */
    private _to;
    /** The playing state */
    private playing;
    /** Internal paused state */
    private _paused;
    /** Tour has ended */
    private _ended;
    /** Paused at timestamp */
    private pausedAt;
    /** Is paused */
    private wasPaused;
    /** Started at timestamp */
    private startedAt;
    /** Unhook user events while playing */
    private unhookEvents;
    /** Set the data */
    constructor(
      micrio: HTMLMicrioElement,
      data: Models.ImageCultureData.VideoTour
    );
    destroy(): void;
    /** Parse the timeline data */
    read(): void;
    get duration(): number;
    set duration(v: number);
    get paused(): boolean;
    get ended(): boolean;
    get currentTime(): number;
    set currentTime(v: number);
    get progress(): number;
    set progress(v: number);
    /** Play/resume the tour */
    play(): Promise<void>;
    /** Pause the tour */
    pause(): void;
    /** Go to time segment index */
    private gotoStep;
    /** Go to the next tour segment */
    private nextStep;
    /** Get a viewport for a step index */
    private getView;
    /** Start a segment animation */
    private startAni;
    /** Set the tour to this progress percentage */
    private setProgress;
    /** Go to a timestamp in seconds */
    private gotoTime;
  }
  /**
   * [[include:types/models.md]]
   */
  export namespace Models {
    /** [[include:types/models.info.md]] */
    namespace ImageInfo {
      /** A Micrio image's main static image data object */
      type ImageInfo = {
        /** The image id
         * @required
         */
        id: string;
        /** The image base path URI, with a trailing `/`
         * @default https://b.micr.io/
         */
        path: string;
        /** The Micrio version this image was created in
         * @default autoloaded
         */
        version: number;
        /** The original image width
         * @default autoloaded
         */
        width: number;
        /** The original image height
         * @default autoloaded
         */
        height: number;
        /** The original tile size in px
         * @default autoloaded
         */
        tileSize: number;
        /** Use an alternative image ID for the image tiles */
        tilesId?: string;
        /** Optional custom file extension for tiles */
        tileExtension?: string;
        /** The image settings, such as viewport/UI settings, camera and user event behavior */
        settings: Partial<ImageInfo.Settings>;
        /** The image title (default: autoloaded) */
        title?: string;
        /** The image slug (default: autoloaded) */
        slug?: string;
        /** The initial data language */
        lang?: string;
        /** The available image data languages, comma-separated (default: autoloaded) */
        cultures?: string;
        /** The image is 360 degrees */
        is360?: boolean;
        /** The image tiles are in WebP format */
        isWebP?: boolean;
        /** The image tiles are in PNG format */
        isPng?: boolean;
        /** Use a custom, single source uri for the zoomable image / video */
        isSingle?: boolean;
        /** A custom format (`dz` for DeepZoom, `iiif` for IIIF) */
        format?: string;
        /** Optional IIIF source for tiles */
        iiifManifest?: string;
        /** Use this for old (<1.8) versions of Micrio */
        legacyTiles?: boolean;
      };
      /** Micrio image settings, which is included as [[`ImageInfo`]]`.settings`. */
      type Settings = {
        /** The starting viewport (`[x0,y0,x1,y1]`) */
        view: View;
        /** Restrict navigation to this viewport (`[x0,y0,x1,y1]`) */
        restrict?: View;
        /** Load the image focussed on this coordinate (`[x, y]`) */
        focus?: number[];
        /** Use a custom uri for the info json file */
        infoUrl?: string;
        /** Render this image as a static image */
        static?: boolean;
        /** Use a custom thumbnail image uri */
        thumbSrc?: string;
        /** The starting viewport. Possible values `cover` and `contain`. Defaults to `contain` */
        initType?: string;
        /** The user cannot zoom out more than a fully covered view */
        limitToCoverScale?: boolean;
        /** Initialize the image when the container is scrolled into view (default: `false`) */
        lazyload?: boolean;
        /** Don't load any custom JS or CSS scripts */
        noExternals?: boolean;
        /** Don't load this image's [[`MicrioData`]] (markers, tours, etc) */
        skipMeta?: boolean;
        /** Do a crossfade when navigating between images (default: true) */
        fadeBetween?: boolean;
        /** Don't stop drawing frames when idle */
        keepRendering?: boolean;
        /** Don't load GTM module */
        noGTag?: boolean;
        /** The camera animation speed (default: 1) */
        camspeed?: number;
        /** Kinetic dragging sensitivity (default: 1) */
        dragElasticity?: number;
        /** The maximum zoom level in % of the original (default: 1) */
        zoomLimit?: number;
        /** Turn off support for high DPI screens */
        noRetina?: boolean;
        /** Adjust the maximum zoom of high DPI screens to that of regular displays */
        zoomLimitDPRFix?: boolean;
        /** Allow the user to pan and zoom out of image bounds */
        freeMove?: boolean;
        /** When navigating back to this image from another image, reset the initial view */
        resetView?: boolean;
        /** Hook user events (default: true) */
        hookEvents?: boolean;
        /** Hook keyboard controls (default: false) */
        hookKeys?: boolean;
        /** Don't allow the user to zoom in or out */
        noZoom?: boolean;
        /** Use the mousewheel or trackpad scrolling for zooming (default: true) */
        hookScroll?: boolean;
        /** Allow pinch to zoom on touch devices (default: true) */
        hookPinch?: boolean;
        /** Allow panning through the image (default: true) */
        hookDrag?: boolean;
        /** Force two-finger panning on touch devices (default: false) */
        twoFingerPan?: boolean;
        /** Force using the CTRL/CMD-keys to zoom in using scrolling (default: false) */
        controlZoom?: boolean;
        /** Don't load any UI elements */
        noUI?: boolean;
        /** Don't show any controls in the UI */
        noControls?: boolean;
        /** Show a fullscreen button if supported */
        fullscreen?: boolean;
        /** Don't show the Micrio logo on the top left */
        noLogo?: boolean;
        /** Don't show the organisation logo on the top right */
        noOrgLogo?: boolean;
        /** Don't show the menu bar with tours and custom pages */
        noToolbar?: boolean;
        /** Show an info modal with the image title and description */
        showInfo?: boolean;
        /** Show a social sharing button */
        social?: boolean;
        /** Show the minimap (default: true) */
        minimap?: boolean;
        /** Don't fade out the minimap (default: false) */
        alwaysShowMinimap?: boolean;
        /** The minimap maximum width, in px (default: 200) */
        minimapWidth?: number;
        /** The minimap maximum height, in px (default: 160) */
        minimapHeight?: number;
        /** More natural camera zooming animation during transitions (default: `true`) */
        doTourJumps?: boolean;
        /** Enable the audio controller (default: `true`) */
        audio?: boolean;
        /** The starting audio volume [0-1] (default: `1`) */
        startVolume?: number;
        /** The music audio volume [0-1] (default: `1`) */
        musicVolume?: number;
        /** The audio volume when other media is playing `[0-1]` (default: `0`) */
        mutedVolume?: number;
        /** Mute the audio when the current browser tab loses focus */
        muteOnBlur?: boolean;
        /** The physical resolution of the object in cm per px */
        cmPerPx?: number;
        /** The physical width of the object in cm */
        cmWidth?: number;
        /** The physical height of the object in cm */
        cmHeight?: number;
        /** Overlapping markers are clustered */
        clusterMarkers?: boolean;
        /** A static split-screen Micrio Image ID */
        micrioSplitLink?: string;
        /** When this is a secondary image in split screen, allow independent navigating */
        secondaryInteractive?: boolean;
        /** When this is a secondary image, don't follow the main image's navigation */
        noFollow?: boolean;
        /** Load a custom JS file with this image */
        js?: {
          /** The asset href */
          href: string;
        };
        /** Load a custom CSS file with this image */
        css?: {
          /** The asset href */
          href: string;
        };
        /** All markers are scaled with the image */
        markersScale?: boolean;
        /** Optional marker settings */
        _markers?: MarkerSettings;
        /** Optional settings for 360 images/video */
        _360?: {
          /** Vertically stretch the image to a full sphere if the image is not 2:1 ratio */
          closeTop?: boolean;
          /** A 360 video object */
          video?: {
            /** Optional video asset object */
            video?: {
              width: number;
              height: number;
              /** The video asset url */
              fileUrl: string;
            };
            /** Try to autoplay the video */
            autoplay?: boolean;
            /** The video is muted */
            muted?: boolean;
            /** Loop the video */
            loop?: boolean;
            /** Show video player controls */
            controls?: boolean;
          };
          /** The Y-orientation in degrees of how the picture was taken */
          orientation?: number;
        };
        /** Freeform custom settings, this is the "Custom JSON" field in the image editor */
        _meta?: {
          /** Optional image crossfade duration, in seconds */
          crossfadeDuration?: number;
          /** An array of JavaScript uris to load for this Micrio instance */
          scripts?: string[];
          /** An array of CSS uris to load for this Micrio instance */
          styles?: string[];
        };
        /** UI customizations */
        ui?: Partial<UserInterfaceSettings>;
      };
      /** Image-wide marker settings */
      type MarkerSettings = {
        /** The uri of the default marker icon */
        markerIcon?: string;
        /** The default marker color */
        markerColor?: string;
        /** The default marker size in px */
        markerSize?: string;
        /** Zoom out when closing a marker */
        zoomOutAfterClose?: boolean;
        /** Relative speed factor when zooming out after close */
        zoomOutAfterCloseSpeed?: number;
        /** Show the titles for all markers on hover */
        showTitles?: boolean;
        /** Don't scale titles if marker is scaling */
        titlesNoScale?: boolean;
        /** All marker popups are static */
        staticPopups?: boolean;
        /** All marker popups are static on mobile */
        staticMobilePopups?: boolean;
        /** All markers are sized to their viewports */
        viewportIsMarker?: boolean;
        /** All marker embeds are printed in HTML, not WebGL */
        embedsInHtml?: boolean;
        /** Auto-start a marker tour when just opening marker */
        autoStartTour?: boolean;
        /** Tour controls in popup */
        tourControlsInPopup?: boolean;
        /** Allow marker popups to be minimized */
        canMinimizePopup?: boolean;
      };
      /** Custom interface settings */
      type UserInterfaceSettings = {
        icons?: {
          /** The raw SVG string for zoom-in */
          zoomIn?: string;
          /** The raw SVG string for zoom-out */
          zoomOut?: string;
          /** The raw SVG string for fullscreen-start */
          fullscreenEnter?: string;
          /** The raw SVG string for fullscreen-stop */
          fullscreenLeave?: string;
          /** The raw SVG string for close */
          close?: string;
          /** Next step button */
          next?: string;
          /** Previous step button */
          prev?: string;
          /** Play button */
          play?: string;
          /** Pause button */
          pause?: string;
          /** Subtitles icon */
          subtitles?: string;
          /** Subtitles turned off icon */
          subtitlesOff?: string;
          /** Muted icon */
          muted?: string;
          /** Unmuted icon */
          unmuted?: string;
        };
      };
    }
    /** [[include:types/models.culturedata.md]] */
    namespace ImageCultureData {
      /** The main data JSON structure */
      type ImageCultureData = {
        /** Markers */
        markers: ImageCultureData.Marker[];
        /** Marker tours */
        markerTours: ImageCultureData.MarkerTour[];
        /** Video tours */
        tours: ImageCultureData.VideoTour[];
        /** Custom menu pages */
        pages: ImageCultureData.Menu[];
        /** Image audio data */
        audio?: {
          /** Music playlist */
          playlist: {
            /** The audio assets */
            items: Assets.Audio[];
            /** Loop the playlist */
            loop: boolean;
          };
          /** Positional audio asset items */
          locations: Assets.AudioLocation[];
        };
        /** Optional lang-specific image description */
        description?: string;
        /** Image copyright information */
        copyright?: string;
        /** Original source URI */
        sourceUrl?: string;
      };
      /** A Marker */
      type Marker = {
        /** The marker ID */
        id: string;
        /** The relative marker X coordinate [0-1] */
        x: number;
        /** The relative marker Y coordinate [0-1] */
        y: number;
        /** The viewport to zoom to when the marker is opened */
        view?: View;
        /** The marker title */
        title?: string;
        /** The marker url slug */
        slug?: string;
        /** Marker main body text */
        body?: string;
        /** Marker markdown markdown rendered body (autogenerated) */
        html?: string;
        /** Marker secondary body text */
        bodySecondary?: string;
        /** Marker classnames */
        class?: string;
        /** Audio asset */
        audio?: Assets.Audio;
        /** Autoplay the audio asset when the marker is opened */
        audioAutoPlay?: boolean;
        /** Don't draw a marker element */
        noMarker?: boolean;
        /** A custom HTML element instead of the default <button> */
        htmlElement?: HTMLElement;
        /** Embedded images into main image */
        embedImages?: Embed[];
        /** An optional iframe embed url */
        embedUrl?: string;
        /** Embed description */
        embedDescription?: string;
        /** Open the iframe embed in a full-window popover overlay */
        embedInPopover?: boolean;
        /** Having the embed iframe printed mutes audio */
        embedMutesAudio?: boolean;
        /** Put the iframe embed as the first image embed */
        embedInEmbed?: boolean;
        /** Put the iframe embed into the image embed on image load */
        embedInEmbedImmediate?: boolean;
        /** Images inside marker popup */
        images?: Assets.Image[];
        /** Video tour which plays when the marker is opened */
        videoTour?: VideoTour;
        /** Optional marker settings */
        data?: {
          /** A custom marker icon image */
          icon?: Assets.Image;
          /** This marker links to this image */
          micrioLink?: ImageInfo.ImageInfo;
          /** This marker opens secondary split image with id */
          micrioSplitLink?: string;
          /** Don't animate the camera when opening this marker */
          noAnimate?: boolean;
          /** Show the title below the marker */
          showTitle?: boolean;
          /** Prevent opening the marker popup */
          noPopup?: boolean;
          /** This marker has a static popup instead of being placed relative to the marker */
          staticPopup?: boolean;
          /** Don't open a large image viewer/gallery on image click */
          preventImageOpen?: boolean;
          /** The marker in-image embeds are the marker trigger instead of a regular marker button */
          embedsAreMarker?: boolean;
          /** The marker in-image embeds stay visible after closing the marker */
          keepEmbedsOpen?: boolean;
          /** Force a marker popup no matter what */
          notEmpty?: boolean;
          /** Jump the camera when opening this marker */
          doJump?: boolean;
          /** This marker is not closeable */
          alwaysOpen?: boolean;
          /** The marker scales with the zooming image */
          scales?: boolean;
          /** Optional custom settings. This is the "Custom JSON" field in the marker editor */
          _meta?: {};
        };
      };
      /**
       * An embedded element inside the main image. This could be an image,
       * or possible iframe embed.
       * This is created in the [Micrio editor](https://dashboard.micr.io/).
       */
      type Embed = MicrioImage & {
        /** The area inside the main image to place the embed */
        area: View;
        /** An optional static file url */
        fileUrl: string;
        /** An optional iframe src url */
        frameSrc: string;
        /** An optional Micrio ID */
        micrioId?: string;
        /** Optional image width */
        width?: number;
        /** Optional image height */
        height?: number;
        /** Optional isPng */
        isPng?: boolean;
        /** Relative scale for embed in 360 */
        scale: number;
        /** X rotation in 360 */
        rotX: number;
        /** Y rotation in 360 */
        rotY: number;
        /** Z rotation in 360 */
        rotZ: number;
      };
      /** The MicrioTour abstract shared class for both [[`MarkerTour`]] and [[`VideoTour`]]
       * @abstract
       */
      type Tour = {
        /** The tour id */
        id: string;
        /** The tour title */
        title: string;
        /** The tour description */
        description: string;
        /** The tour url slug */
        slug: string;
        /** Autostart this tour on image load */
        autostart?: boolean;
        /** Auto-minimize controls while playing and idle */
        minimize?: boolean;
        /** Cannot close this tour */
        cannotClose?: boolean;
      };
      /**
       * A Micrio video tour -- a timed sequence of viewport, with optional audio file.
       * This is created in the [Micrio editor](https://dashboard.micr.io/).
       */
      type VideoTour = Tour & {
        /** The tour duration in seconds */
        duration: number;
        /** The timeline data */
        timeline: {
          /** Start time in seconds */
          start: number;
          /** End time in seconds */
          end: number;
          /** View rectangle */
          rect: View;
        }[];
        /** Custom events in tour timeline */
        events?: Event[];
        /** An optional audio file */
        audio?: Assets.Audio;
        /** Don't hide the markers when running */
        keepMarkers?: boolean;
        /** Don't disable user navigation when running */
        keepInteraction?: boolean;
        /** Optional subtitles */
        subtitle?: Assets.Subtitle;
      };
      /** Timed events inside a [[`MicrioVideoTour`]] */
      type Event = {
        /** Start time in seconds */
        start: number;
        /** End time in seconds */
        end: number;
        /** Custom event name */
        action?: string;
        /** Custom event data */
        data?: string;
        /** Optional ID to hook to */
        id?: string;
      };
      /**
       * A Micrio marker tour -- a sequence of markers, which the user can navigate
       * through. This is created in the [Micrio editor](https://dashboard.micr.io/).
       */
      type MarkerTour = Tour & {
        /** Tour steps */
        steps: string[];
        /** Show the tour controls */
        controls?: boolean;
        /** Optional tour image asset */
        image?: Assets.Image;
        /** Hide markers when tour is running */
        hideMarkers?: boolean;
        /** This is a scrolling tour */
        scrollable?: boolean;
        /** Don't reset view when tour ends */
        keepLastStep?: boolean;
        /** Chapter-based multi-video serial tour */
        isSerialTour?: boolean;
        /** Print the chapters in the interface */
        printChapters?: boolean;
        /** Internally calculated total duration, sum of all step durations */
        duration?: number;
        /** Current tour step getter */
        currentStep?: number;
      };
      /**
       * A custom pop-out menu containing content pages or direct external links to
       * websites, or direct links to opening a marker.
       * This is created in the [Micrio editor](https://dashboard.micr.io/).
       */
      type Menu = {
        /** The menu title */
        title: string;
        /** Child menu elements */
        children?: Menu[];
        /** Open this marker when clicking menu */
        markerId?: string;
        /** Direct link url for menu button */
        link?: string;
        /** Optional direct action function when clicked */
        action?: Function;
        /** For page: iframe embed */
        embed?: string;
        /** For page: page image */
        image?: string;
        /** For page: content HTML */
        content?: string;
        /** For page: content markdown */
        markdown?: string;
      };
    }
    namespace Assets {
      type Audio = {
        /** The sample duration */
        duration: number;
        /** The item id */
        id: string;
        /** The sample file name */
        fileName: string;
        /** The audio file uri
         * @deprecated
         */
        fileUrl: string;
        /** The audio file uri */
        src: string;
      };
      type AudioLocation = Audio & {
        /** Autoplay the sample */
        autoplay: boolean;
        /** Loop the audio */
        loop: boolean;
        /** Don't play on mobile */
        noMobile: boolean;
        /** The radius of the audible circle */
        radius: number;
        /** Pause X seconds between plays */
        repeatAfter: number;
        /** The sample volume */
        volume: number;
        /** The x coordinate */
        x: number;
        /** The y coordinate */
        y: number;
      };
      /** An image asset uploaded in the Micrio editor */
      type Image = {
        id: string;
        /** The image original width */
        width: number;
        /** The image original height */
        height: number;
        /** Original image source uri */
        src: string;
        /** If the image is available as Micrio image, its ID */
        micrioId: string;
        /** If the image has a Micrio version, optional alternative image tile ID */
        tilesId: string;
        /** Image title / filename */
        title: string;
        /** The image description */
        description: string;
      };
      type Subtitle = {
        fileSize: number;
        fileUrl: string;
        mimeType: string;
        title: string;
      };
    }
  }
  /** The Micrio version */
  export const VERSION: string;
  export class GoogleTag {
    private micrio;
    /** Google Tag Manager tracker
     * @param {!HTMLMicrioElement} micrio The Micrio instance
     */
    constructor(micrio: HTMLMicrioElement);
  }
}
/**
 * [[include:types/store.d.md]]
 * @category Svelte
 * @module SvelteStore
 * @package svelte
 * @author [These people](https://github.com/sveltejs/svelte/graphs/contributors)
 * @license MIT https://github.com/sveltejs/svelte/blob/master/LICENSE.md
 * @link https://svelte.dev/tutorial/writable-stores
 */
declare module "svelte/store" {
  /** Callback to inform of a value updates.
   */
  export type Subscriber<T> = (value: T) => void;
  /** Unsubscribes from value updates.
   */
  export type Unsubscriber = () => void;
  /** Callback to update a value.
   */
  export type Updater<T> = (value: T) => T;
  /** Cleanup logic callback. */
  type Invalidator<T> = (value?: T) => void;
  /** Start and stop notification callbacks.
   * @internal
   */
  export type StartStopNotifier<T> = (
    set: Subscriber<T>
  ) => Unsubscriber | void;
  /** Readable interface for subscribing. See the main [[`SvelteStore`]] article on how to use it in Micrio. */
  export interface Readable<T> {
    /**
     * Subscribe on value changes.
     * @param run subscription callback
     * @param invalidate cleanup callback
     */
    subscribe(
      this: void,
      run: Subscriber<T>,
      invalidate?: Invalidator<T>
    ): Unsubscriber;
  }
  /** Writable interface for both updating and subscribing. See the main [[`SvelteStore`]] article on how to use it in Micrio. */
  export interface Writable<T> extends Readable<T> {
    /**
     * Set value and inform subscribers.
     * @param value to set
     */
    set(this: void, value: T): void;
    /**
     * Update value using callback and inform subscribers.
     * @param updater callback
     */
    update(this: void, updater: Updater<T>): void;
  }
  /**
   * Creates a `Readable` store that allows reading by subscription.
   * @internal
   * @param value initial value
   * @param {StartStopNotifier}start start and stop notifications for subscriptions
   */
  export function readable<T>(
    value?: T,
    start?: StartStopNotifier<T>
  ): Readable<T>;
  /**
   * Create a `Writable` store that allows both updating and reading by subscription.
   * @internal
   * @param {*=}value initial value
   * @param {StartStopNotifier=}start start and stop notifications for subscriptions
   */
  export function writable<T>(
    value?: T,
    start?: StartStopNotifier<T>
  ): Writable<T>;
  /** One or more `Readable`s.
   * @internal
   */
  type Stores =
    | Readable<any>
    | [Readable<any>, ...Array<Readable<any>>]
    | Array<Readable<any>>;
  /** One or more values from `Readable` stores.
   * @internal
   */
  type StoresValues<T> = T extends Readable<infer U>
    ? U
    : {
        [K in keyof T]: T[K] extends Readable<infer U> ? U : never;
      };
  /**
   * Derived value store by synchronizing one or more readable stores and
   * applying an aggregation function over its input values.
   *
   * @internal
   * @param stores - input stores
   * @param fn - function callback that aggregates the values
   * @param initial_value - when used asynchronously
   */
  export function derived<S extends Stores, T>(
    stores: S,
    fn: (
      values: StoresValues<S>,
      set: (value: T) => void
    ) => Unsubscriber | void,
    initial_value?: T
  ): Readable<T>;
  /**
   * Derived value store by synchronizing one or more readable stores and
   * applying an aggregation function over its input values.
   *
   * @internal
   * @param stores - input stores
   * @param fn - function callback that aggregates the values
   * @param initial_value - initial value
   */
  export function derived<S extends Stores, T>(
    stores: S,
    fn: (values: StoresValues<S>) => T,
    initial_value?: T
  ): Readable<T>;
  /**
   * Derived value store by synchronizing one or more readable stores and
   * applying an aggregation function over its input values.
   *
   * @internal
   * @param stores - input stores
   * @param fn - function callback that aggregates the values
   */
  export function derived<S extends Stores, T>(
    stores: S,
    fn: (values: StoresValues<S>) => T
  ): Readable<T>;
  /**
   * Get the current value from a store by subscribing and immediately unsubscribing.
   * @internal
   * @param store readable
   */
  export function get<T>(store: Readable<T>): T;
}
