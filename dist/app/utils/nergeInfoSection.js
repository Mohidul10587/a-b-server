"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeInfoSections = void 0;
const mergeInfoSections = (primary, secondary) => {
    return primary.map((primarySection) => {
        const matchingSecondarySection = secondary.find((sec) => sec._id === primarySection._id);
        const mergedFields = primarySection.fields.map((primaryField) => {
            const matchingSecondaryField = (matchingSecondarySection === null || matchingSecondarySection === void 0 ? void 0 : matchingSecondarySection.fields.find((secField) => secField._id === primaryField._id)) || {};
            return Object.assign(Object.assign({}, primaryField), { content: matchingSecondaryField.content || "No info !", display: matchingSecondaryField.display !== undefined
                    ? matchingSecondaryField.display
                    : primaryField.display || false });
        });
        return Object.assign(Object.assign({}, primarySection), { fields: mergedFields });
    });
};
exports.mergeInfoSections = mergeInfoSections;
