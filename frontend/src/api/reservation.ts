export const postReservation = async (
    spot_id: number,
    start: Date,
    end: Date
) => {
    // const url = `/api/reservation`
    // fetch(url, {
    //   method: "POST",
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     spot_id,
    //     start,
    //     end
    //   }),
    // })
    //   .then(() => {
    //     alert("Wyslano dane")
    //     return { message: "adsf" }
    //   })
    //
    //   .catch(() => {
    //     alert("Blad w wyslaniu danych")
    //     return apiErrorModel("Network error", "posting reservation")
    //   })

    console.log(
        "Making reservation for spot ",
        spot_id,
        " from ",
        start,
        " to ",
        end
    );
    return { message: "ok" };
};
