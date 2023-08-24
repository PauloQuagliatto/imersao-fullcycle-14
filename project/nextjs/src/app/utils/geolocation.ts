export function getCurrentPosition(
  options?: PositionOptions
): Promise<{ lat: number; lng: number }> {
  return new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        return resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      function(error) {
        return reject(error);
      },
      options
    );
  });
}
