function onImgError(element, type = '') {
  switch (type) {
      case 'product':
          element.src = "assets/images/select-image.png";
        break;
      default:
        break;
  }
  return true;
};
