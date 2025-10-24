import React from 'react';
const NumberFormat = ({number, unit})=>
{
    const formattedNumber = new Intl.NumberFormat('fr-FR').format(number);
    return <span>{formattedNumber} {unit ||''}</span>;
}
export const formatNumber = (value) => {
    if (!value) return value;
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
export const handleMontantChange = (event, formik, fieldName) => {
    const input = event.target;
    const rawValue = input.value.replace(/,/g, '').replace(/[^\d]/g, ''); // Supprime les séparateurs et caractères invalides
    const formattedValue = formatNumber(rawValue);

    // Calcule la nouvelle position du curseur
    const cursorPosition = input.selectionStart + (formattedValue.length - input.value.length);

    // Met à jour la valeur brute et formatée
    if(formik) {
        formik.setFieldValue(fieldName, rawValue);
    }
    input.value = formattedValue;

    // Réinitialise la position du curseur
    setTimeout(() => input.setSelectionRange(cursorPosition, cursorPosition), 0);
};

export const getRawValue = (formatedValue) => {
    const rawValue = formatedValue.replace(/,/g, '').replace(/[^\d]/g, ''); // Supprime les séparateurs et caractères invalides
    return rawValue;
}
export default NumberFormat;