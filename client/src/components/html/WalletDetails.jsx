import PropTypes from "prop-types";

export const WalletDetails = ({ wallet }) => {
  return (
    <div className="game__menu-warning">
      <div className="">Add: {wallet.account.address.slice(0, 5)}</div>
    </div>
  );
};

WalletDetails.propTypes = {
  wallet: PropTypes.shape({
    account: PropTypes.shape({
      address: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};
