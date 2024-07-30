const generateTokenExpirationDate = () => {
  const farFutureDate = new Date();

  farFutureDate.setFullYear(farFutureDate.getFullYear() + 100);

  return farFutureDate;
};

export default generateTokenExpirationDate;
