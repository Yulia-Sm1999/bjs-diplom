"use strict";

let logoutButton = new LogoutButton();
logoutButton.action = () => ApiConnector.logout((response) => {
  if (response.success) {
    location.reload();
  };
});

ApiConnector.current((response) => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  };
});

let ratesBoard = new RatesBoard();

let getStocks = () => ApiConnector.getStocks((response) => {
  if (response.success) {
    ratesBoard.clearTable();
    ratesBoard.fillTable(response.data);
  }
});
getStocks();
setInterval(() => getStocks(), 60000);

let moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = ({ currency, amount }) => ApiConnector.addMoney({ currency, amount }, response => {
  let message = response.success ? 'Баланс успешно пополнен' : response.error;
  if (response.success) {
    ProfileWidget.showProfile(response.data);
    moneyManager.setMessage(response.success, message);
  };
  moneyManager.setMessage(response.success, message);
});

moneyManager.conversionMoneyCallback = ({ fromCurrency, targetCurrency, fromAmount }) => ApiConnector.convertMoney({ fromCurrency, targetCurrency, fromAmount }, response => {
  let message = response.success ? 'Конвертация валют успешно осуществлена' : response.error;
  if (response.success) {
    ProfileWidget.showProfile(response.data);
    moneyManager.setMessage(response.success, message);
  };
  moneyManager.setMessage(response.success, message);
});

moneyManager.sendMoneyCallback = ({ to, currency, amount }) => ApiConnector.transferMoney({ to, currency, amount }, response => {
  let message = response.success ? 'Перевод успешно осуществлен' : response.error;
  if (response.success) {
    ProfileWidget.showProfile(response.data);
    moneyManager.setMessage(response.success, message);
  };
  moneyManager.setMessage(response.success, message);
});

let favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites((response) => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  };
});

favoritesWidget.addUserCallback = ({ id, name }) => (ApiConnector.addUserToFavorites({ id, name }, response => {
  let message = response.success ? 'Пользователь успешно добавлен в список избранных' : response.error;
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
    moneyManager.setMessage(response.success, message);
  };
  moneyManager.setMessage(response.success, message);
}));

favoritesWidget.removeUserCallback  = (id) => (ApiConnector.removeUserFromFavorites(id, response => {
  let message = response.success ? 'Пользователь успешно удален из списка избранных' : response.error;
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
    moneyManager.setMessage(response.success, message);
  };
  moneyManager.setMessage(response.success, message);
}))