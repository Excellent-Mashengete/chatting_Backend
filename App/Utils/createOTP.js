
const OTPPin = () => {
//Create an OTP Pin for verifying uppon login
    let otp_pin;
    for (let i = 0; i <4 ; i++) {
        let randomNum = parseInt(1000 + Math.random() * (9000 - 1000))
        otp_pin = randomNum;
    }
    return otp_pin;
}

module.exports = {
    OTPPin
}