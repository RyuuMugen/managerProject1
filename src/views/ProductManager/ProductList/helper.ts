export const handleShowErrorValidate = (
  label: string,
  textError: string,
  dataListErrorValidate: string[] | undefined
) => {
  return dataListErrorValidate
    ? dataListErrorValidate.includes(label)
      ? textError
      : false
    : false;
};

export const validateData = (
  data: any,
  requiredFields: string[],
  setDataListErrorValidate: Function
) => {
  const errors: string[] = [];

  requiredFields.forEach((field) => {
    if (!data[field]) {
      errors.push(field);
    }
  });
  setDataListErrorValidate(errors);
  return errors.length === 0 ? true : false;
};
