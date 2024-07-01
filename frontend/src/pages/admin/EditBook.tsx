import { useParams } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';

import PageLayout from 'layouts/PageLayout';
import FormInput from 'components/forms/FormInput';
import AuthButton from 'components/forms/AuthButton';

import TextArea from 'components/forms/TextArea';
import { useAppSelector } from 'hooks/useRootStorage';
import { useUpdateBookMutation } from 'services/apis/bookApi/bookStoreApi';

import GiBookCoverDark from 'assets/gi-book-cover-dark.svg';
import GiBookCoverLight from 'assets/gi-book-cover-light.svg';

import Constants from 'Constants';
import { getDateProps, showAlert, checkArrayEquality } from 'utils';

const EditBook = () => {
  const { ACCEPTED_IMAGE_TYPES } = Constants;

  const { id } = useParams();
  const { allBooks } = useAppSelector(state => state.bookStore);
  const { prefersDarkMode } = useAppSelector(state => state.userData);
  const { _id: userID } = useAppSelector(state => state.userStore.currentUser);

  const [coverImageChanged, setCoverImageChanged] = useState<boolean>(false);
  const [imageContentsChanged, setImageContentsChanged] = useState<boolean>(false);
  const { pages, title, content, authors, category, updatedAt, coverImageUrl, imageContentUrls } =
    allBooks.find(({ _id }) => _id === id)!;
  const { longMonthName, monthDate, hour24, minutes, year } = getDateProps(updatedAt);

  const pagesRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const authorsRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);
  const imageContentsRef = useRef<HTMLInputElement>(null);
  const coverImagePreviewRef = useRef<HTMLImageElement>(null);

  const [updateBook, { error, isError, isLoading, isSuccess }] = useUpdateBookMutation();

  const updatePreviewImage = (imageFile?: File | null) => {
    const imageTag: HTMLImageElement = coverImagePreviewRef.current!;

    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.addEventListener('load', () => {
        const result = `${reader.result ?? ''}`;
        imageTag.src = result;
      });
      setCoverImageChanged(true);
    } else {
      imageTag.src = coverImageUrl || prefersDarkMode ? GiBookCoverDark : GiBookCoverLight;
      setCoverImageChanged(false);
    }
  };

  const handleUpdateBook = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const SEPARATOR = ',';
    const newTitle: string = titleRef.current!.value;
    const newContent: string = contentRef.current!.value;
    const newCategory: string = categoryRef.current!.value;
    const newPages: number = Number(pagesRef.current!.value);
    const imageContents: FileList | null = imageContentsRef.current!.files;
    const coverImage: File | undefined = coverImageRef.current!.files?.[0];
    const newAuthors: string[] = authorsRef
      .current!.value.trim()
      .replaceAll(', ', SEPARATOR)
      .split(SEPARATOR)
      .filter(author => author.length > 0);

    const bookPayload: UpdateBookPayload = { _id: id!, userID };

    if (pages !== newPages) bookPayload.pages = newPages;
    if (title !== newTitle) bookPayload.title = newTitle;
    if (content !== newContent) bookPayload.content = newContent;
    if (category !== newCategory) bookPayload.category = newCategory;
    if (coverImageChanged) bookPayload.coverImageContent = coverImage;
    if (imageContentsChanged) bookPayload.imageContents = imageContents;
    if (!checkArrayEquality(authors, newAuthors)) bookPayload.authors = newAuthors;

    if (Object.keys(bookPayload).length === 2) {
      return showAlert({ msg: 'No changes made!' });
    }

    updateBook(bookPayload);
  };

  useEffect(() => {
    if (isSuccess) {
      setCoverImageChanged(false);
      setImageContentsChanged(false);
      showAlert({ msg: 'Book update successful' });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error && 'status' in error) {
      showAlert({ msg: `${error.data ?? ''}` });
      console.error(error);
    }
  }, [error, isError]);

  return (
    <PageLayout
      extraClassNames={`pl-[1.5%] pr-10 bg-swan-white p-8 rounded-lg grid grid-cols-[40%_60%] gap-5 ${
        prefersDarkMode && 'dark:bg-nile-blue-900'
      }`}>
      <label
        htmlFor='cover-image'
        className={`cursor-pointer h-[80vh] shadow rounded-md overflow-hidden border-current ${
          coverImageUrl || 'border-4'
        }`}>
        <img
          alt=''
          loading='lazy'
          ref={coverImagePreviewRef}
          className={`mx-auto h-full ${coverImageUrl || coverImageChanged ? 'w-full' : 'w-2/5'}`}
          src={coverImageUrl || (prefersDarkMode ? GiBookCoverDark : GiBookCoverLight)}
        />
      </label>

      <form onSubmit={handleUpdateBook}>
        <h1 className='text-2xl font-semibold mt-4'>Edit Book information</h1>
        <p>
          Last updated at {longMonthName} {monthDate}, {year} @ {hour24}:{minutes}
        </p>

        <FormInput
          required
          type='text'
          label='Title'
          autoComplete='off'
          spellCheck={false}
          inputRef={titleRef}
          inputID='book-title'
          defaultValue={title}
          inputName='book-title'
          extraLabelClassNames='mt-8'
          extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
        />

        <FormInput
          type='text'
          label='Pages'
          inputID='pages'
          inputName='pages'
          autoComplete='off'
          inputRef={pagesRef}
          extraLabelClassNames='mt-[15px]'
          formatRule={{ allowedChars: '0123456789' }}
          defaultValue={(pages > 0 ? pages : '').toString()}
          extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
        />

        <FormInput
          type='text'
          label='Category'
          autoComplete='off'
          spellCheck={false}
          inputRef={categoryRef}
          defaultValue={category}
          inputID='book-category'
          inputName='book-category'
          extraLabelClassNames='mt-[15px]'
          extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
        />

        <FormInput
          type='text'
          label='Authors'
          autoComplete='off'
          spellCheck={false}
          inputRef={authorsRef}
          inputID='book-authors'
          inputName='book-authors'
          extraLabelClassNames='mt-[15px]'
          defaultValue={authors.join(', ')}
          extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
        />

        <TextArea
          cols={30}
          rows={10}
          spellCheck
          label='Content'
          defaultValue={content}
          textAreaRef={contentRef}
          textareaID='book-content'
          textareaName='book-content'
          extraLabelClassNames='mt-[15px]'
          extraTextareaClassNames={`resize-y ${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
        />

        <FormInput
          type='file'
          inputID='cover-image'
          label='Book Cover Image'
          inputName='cover-image'
          inputRef={coverImageRef}
          accept={ACCEPTED_IMAGE_TYPES}
          extraLabelClassNames='mt-[15px]'
          extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
          onChange={e => {
            const imageFile: File | undefined = e.target.files?.[0];
            updatePreviewImage(imageFile);
          }}
        />

        <FormInput
          multiple
          type='file'
          label='Image Contents'
          inputID='image-contents'
          inputName='image-contents'
          inputRef={imageContentsRef}
          accept={ACCEPTED_IMAGE_TYPES}
          extraLabelClassNames='mt-[15px]'
          onChange={() => setImageContentsChanged(true)}
          extraInputClassNames={`${prefersDarkMode && 'dark:bg-nile-blue-950'}`}
        />

        <AuthButton
          type='submit'
          title='Update'
          disabled={isLoading}
          isLoading={isLoading}
          extraClassNames={`!w-1/2 mx-auto ${
            prefersDarkMode &&
            'dark:bg-zircon dark:text-nile-blue-900 dark:hover:bg-transparent dark:hover:text-zircon'
          }`}
        />
      </form>
    </PageLayout>
  );
};

export default EditBook;
