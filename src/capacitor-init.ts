import { Capacitor } from '@capacitor/core';

export async function initCapacitor() {
  if (!Capacitor.isNativePlatform()) return;

  try {
    // Dynamically import native plugins only on native platforms
    const [{ StatusBar, Style }, { SplashScreen }, { Keyboard }, { App }] = await Promise.all([
      import('@capacitor/status-bar'),
      import('@capacitor/splash-screen'),
      import('@capacitor/keyboard'),
      import('@capacitor/app'),
    ]);

    // Status bar — dark icons on light bg
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: '#1a1a2e' });

    // Hide splash after app is rendered
    SplashScreen.hide({ fadeOutDuration: 300 });

    // Keyboard — resize body so inputs stay visible
    Keyboard.setResizeMode({ mode: 'body' as any });

    // Handle Android back button
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });
  } catch (e) {
    // Silently fail on web — plugins not available
    console.debug('Capacitor plugins not available:', e);
  }
}
