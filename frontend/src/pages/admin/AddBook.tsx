import { useRef, useState, useEffect } from 'react';

import PageLayout from 'layouts/PageLayout';
import FormInput from 'components/forms/FormInput';
import AuthButton from 'components/forms/AuthButton';

import TextArea from 'components/forms/TextArea';
import { useAppSelector } from 'hooks/useRootStorage';
import { useCreateBookMutation } from 'services/apis/bookApi/bookStoreApi';

import GiBookCoverDark from 'assets/gi-book-cover-dark.svg';
import GiBookCoverLight from 'assets/gi-book-cover-light.svg';

import Constants from 'Constants';
import { showAlert } from 'utils';

const AddBook = () => {
  const { ACCEPTED_IMAGE_TYPES } = Constants;

  const { prefersDarkMode } = useAppSelector(state => state.userData);
  const { _id: userID } = useAppSelector(state => state.userStore.currentUser);

  const [coverImageChanged, setCoverImageChanged] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const pagesRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const authorsRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);
  const imageContentsRef = useRef<HTMLInputElement>(null);
  const coverImagePreviewRef = useRef<HTMLImageElement>(null);

  const [createBook, { error, isError, isLoading, isSuccess }] = useCreateBookMutation();

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
      imageTag.src = prefersDarkMode ? GiBookCoverDark : GiBookCoverLight;
      setCoverImageChanged(false);
    }
  };

  const handleAddBook = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const SEPARATOR = ',';
    const title: string = titleRef.current!.value;
    const content: string = contentRef.current!.value;
    const category: string = categoryRef.current!.value;
    const pages: number = Number(pagesRef.current!.value);
    const imageContents: FileList | null = imageContentsRef.current!.files;
    const coverImageContent: File | undefined = coverImageRef.current!.files?.[0];
    const authors: string[] = authorsRef
      .current!.value.trim()
      .replaceAll(', ', SEPARATOR)
      .split(SEPARATOR)
      .filter(author => author.length > 0);

    const bookPayload: AddBookPayload = {
      title,
      pages,
      userID,
      authors,
      content,
      category,
      imageContents,
      coverImageContent
    };

    createBook(bookPayload);
  };

  useEffect(() => {
    if (isSuccess) {
      setCoverImageChanged(false);
      showAlert({ msg: 'Book added successfully' });
      formRef.current!.reset();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && error && 'status' in error) {
      showAlert({ msg: `${error.data ?? ''}` });
      console.error(error);
    }
  }, [error, isError]);

  return (
    <PageLayout extraClassNames='pl-[1.5%] pr-10 bg-white p-8 rounded-lg dark:bg-nile-blue-900 grid grid-cols-[40%_60%] gap-5'>
      <label
        htmlFor='cover-image'
        className={`cursor-pointer h-[80vh] shadow rounded-md overflow-hidden border-current ${
          coverImageChanged || 'border-4'
        }`}>
        <img
          alt=''
          loading='lazy'
          ref={coverImagePreviewRef}
          src={prefersDarkMode ? GiBookCoverDark : GiBookCoverLight}
          className={`mx-auto h-full ${coverImageChanged ? 'w-full' : 'w-2/5'}`}
        />
      </label>

      <form onSubmit={handleAddBook} ref={formRef}>
        <h1 className='text-2xl font-semibold mt-4'>New Book information</h1>

        <FormInput
          required
          type='text'
          label='Title'
          autoComplete='off'
          spellCheck={false}
          inputRef={titleRef}
          inputID='book-title'
          inputName='book-title'
          extraLabelClassNames='mt-8'
          extraInputClassNames='dark:bg-nile-blue-950'
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
          extraInputClassNames='dark:bg-nile-blue-950'
        />

        <FormInput
          type='text'
          label='Category'
          autoComplete='off'
          spellCheck={false}
          inputRef={categoryRef}
          inputID='book-category'
          inputName='book-category'
          extraLabelClassNames='mt-[15px]'
          extraInputClassNames='dark:bg-nile-blue-950'
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
          extraInputClassNames='dark:bg-nile-blue-950'
        />

        <TextArea
          cols={30}
          rows={10}
          spellCheck
          label='Content'
          textAreaRef={contentRef}
          textareaID='book-content'
          textareaName='book-content'
          extraLabelClassNames='mt-[15px]'
          extraTextareaClassNames='resize-y dark:bg-nile-blue-950'
        />

        <FormInput
          type='file'
          inputID='cover-image'
          label='Book Cover Image'
          inputName='cover-image'
          inputRef={coverImageRef}
          accept={ACCEPTED_IMAGE_TYPES}
          extraLabelClassNames='mt-[15px]'
          extraInputClassNames='dark:bg-nile-blue-950'
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
          extraInputClassNames='dark:bg-nile-blue-950'
        />

        <AuthButton
          type='submit'
          title='Add Book'
          disabled={isLoading}
          isLoading={isLoading}
          extraClassNames='!w-1/2 mx-auto dark:bg-zircon dark:text-nile-blue-900 dark:hover:bg-transparent dark:hover:text-zircon'
        />
      </form>
    </PageLayout>
  );
};

export default AddBook;
