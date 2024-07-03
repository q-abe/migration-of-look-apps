import type { FC} from "react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Checkbox,
  Combobox,
  FormLayout,
  Icon,
  Listbox,
  Spinner,
  Tag,
  TextField,
} from "@shopify/polaris";
import type { Gallery } from '../../../prisma/models/Gallery.model';
import { GalleryAPI } from '../../../../Documents/Project/Q/public-look-app/src/api/GalleryAPI';
import { useAuthenticatedAPI } from '../../hooks/useAuthenticatedAPI';
import type { LookCard } from '../../../../Documents/Project/Q/public-look-app/src/types/LookCard';


import DateTimePicker from "../DateTimePicker";
import { useEdit } from "./LookEditModal";

const SettingForm: FC<{
  isLoading?: boolean;
  onSave?: (look: LookCard) => void;
  hideGalleries?: boolean;
}> = ({ isLoading = false, onSave, hideGalleries = false }) => {
  const { editedLook, updateEditedLookByKey } = useEdit();

  const onChangeActive = useCallback((newChecked: boolean) => {
    updateEditedLookByKey?.("isActive", newChecked);
  }, []);

  const onChangeModelDescription = useCallback((value: string) => {
    updateEditedLookByKey?.("modelDescription", value);
  }, []);

  const onUpdateGallery = useCallback((value: Gallery[]) => {
    updateEditedLookByKey?.("galleries", value);
  }, []);

  const onChangePublishDate = useCallback((value: string) => {
    updateEditedLookByKey?.("publishedAt", value);
  }, []);

  const onChangeUnpublishedDate = useCallback((value: string) => {
    updateEditedLookByKey?.("unpublishedAt", value);
  }, []);

  const onChangeShouldDisplayProduct = useCallback((newChecked: boolean) => {
    updateEditedLookByKey?.("shouldDisplayProduct", newChecked);
  }, []);

  const onClickSave = useCallback(() => {
    if (typeof editedLook === "undefined") return;
    onSave?.(editedLook);
  }, [onSave, editedLook]);

  if (isLoading) {
    return (
      <FormLayout>
        <Spinner />
      </FormLayout>
    );
  }

  return (
    <FormLayout>
      <Checkbox
        label="ルックを有効にする"
        checked={editedLook?.isActive}
        onChange={onChangeActive}
      />
      <TextField
        label="モデル情報"
        type="text"
        value={editedLook?.modelDescription}
        onChange={onChangeModelDescription}
        autoComplete="off"
      />
      {!hideGalleries ? (
        <GalleryComboBox
          selectedGalleries={editedLook?.galleries}
          onRemove={onUpdateGallery}
          onSelect={onUpdateGallery}
        />
      ) : null}
      <FormLayout.Group>
        <DateTimePicker
          label="公開開始日時"
          value={editedLook?.publishedAt}
          onAcceptedCallback={onChangePublishDate}
        />
        <DateTimePicker
          label="公開終了日時"
          value={editedLook?.unpublishedAt}
          onAcceptedCallback={onChangeUnpublishedDate}
        />
      </FormLayout.Group>
      <Checkbox
        label="PDPに表示する"
        checked={editedLook?.shouldDisplayProduct}
        onChange={onChangeShouldDisplayProduct}
      />
      <Button onClick={onClickSave} primary>
        保存する
      </Button>
    </FormLayout>
  );
};

const GalleryComboBox: FC<{
  selectedGalleries?: Gallery[];
  onSelect?: (selectedGalleries: Gallery[]) => void;
  onRemove?: (selectedGalleries: Gallery[]) => void;
}> = ({ selectedGalleries, onSelect: _onSelect, onRemove: _onRemove }) => {
  const galleryAPI = useAuthenticatedAPI(GalleryAPI);

  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [inputtedValue, setInputtedValue] = useState<string>();

  useEffect(() => {
    (async () => {
      const galleries = await galleryAPI.getAll();
      setGalleries(galleries);
      setIsLoading(false);
    })();
  }, []);

  const placeholder = useMemo(() => {
    return isLoading ? "読み込み中" : "ギャラリー名で検索";
  }, [isLoading]);

  const options = useMemo(() => {
    const options = galleries.map((gallery) => {
      return {
        value: `${gallery.id}`,
        label: gallery.title,
      };
    });
    if (!inputtedValue) return options;
    const filterRegex = new RegExp(inputtedValue, "i");
    return options.filter((option) => option.label?.match(filterRegex));
  }, [galleries, inputtedValue]);

  const Selected = useMemo(() => {
    return selectedGalleries?.length ? (
      <Stack spacing="tight" alignment="center">
        {selectedGalleries.map((selectedGallery) => {
          const onRemove = () => {
            _onRemove?.(
              selectedGalleries.filter(
                (currentGallery) => currentGallery.id !== selectedGallery.id
              )
            );
          };

          return (
            <Tag key={`tag-${selectedGallery.id}`} onRemove={onRemove}>
              {selectedGallery.title}
            </Tag>
          );
        })}
      </Stack>
    ) : null;
  }, [_onRemove, selectedGalleries]);

  const onSelect = useCallback(
    (value: string) => {
      const currentGalleries = [...(selectedGalleries ?? [])];
      const newGallery = galleries.find((gallery) => `${gallery.id}` === value);
      if (!newGallery) return;
      if (
        currentGalleries.some(
          (currentGallery) => `${currentGallery.id}` === value
        )
      ) {
        _onSelect?.(
          currentGalleries.filter(
            (currentGallery) => `${currentGallery.id}` !== value
          )
        );
      } else {
        _onSelect?.([...currentGalleries, newGallery]);
      }
    },
    [_onSelect, galleries, selectedGalleries]
  );

  const calcIsSelected = useCallback(
    (value: string) => {
      return (
        selectedGalleries?.some(
          (selectedGallery) => `${selectedGallery.id}` === value
        ) ?? false
      );
    },
    [selectedGalleries]
  );

  return (
    <>
      <Combobox
        activator={
          <Combobox.TextField
            prefix={<Icon source={SearchMinor} />}
            onChange={setInputtedValue}
            label="所属ギャラリー"
            value={inputtedValue}
            placeholder={placeholder}
            autoComplete="off"
            disabled={isLoading}
          />
        }
        allowMultiple
      >
        {options.length ? (
          <Listbox onSelect={onSelect}>
            {options.map(({ value, label }) => (
              <Option
                key={value}
                value={value}
                label={label ?? ""}
                calcIsSelected={calcIsSelected}
              />
            ))}
          </Listbox>
        ) : null}
      </Combobox>
      {Selected}
    </>
  );
};

const Option: FC<{
  value: string;
  label: string;
  calcIsSelected?: (value: string) => boolean;
}> = ({ value, label, calcIsSelected }) => {
  const isSelected = useMemo(() => {
    return calcIsSelected?.(value) ?? false;
  }, [value, calcIsSelected]);
  return (
    <Listbox.Option
      key={value}
      value={value}
      selected={isSelected}
      accessibilityLabel={label}
    >
      {label}
    </Listbox.Option>
  );
};

export default SettingForm;
